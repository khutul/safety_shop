# -*- coding: utf-8 -*-
from odoo import api, fields, models, _
from odoo.exceptions import ValidationError


class SafetyCatalogCategory(models.Model):
    _name = "safety.catalog.category"
    _description = "Storefront Category"
    _parent_name = "parent_id"
    _parent_store = True
    _order = "sequence, complete_name"

    name = fields.Char(string="Name", required=True, translate=True)
    complete_name = fields.Char(
        string="Complete Name",
        compute="_compute_complete_name",
        recursive=True,
        store=True,
    )
    parent_id = fields.Many2one(
        comodel_name="safety.catalog.category",
        string="Parent Category",
        ondelete="restrict",
        index=True,
    )
    parent_path = fields.Char(index=True)
    child_ids = fields.One2many(
        comodel_name="safety.catalog.category",
        inverse_name="parent_id",
        string="Child Categories",
    )
    sequence = fields.Integer(string="Sequence", default=10)
    slug = fields.Char(
        string="URL Slug",
        help="Used to build the storefront URL in the Next.js frontend.",
    )
    image = fields.Image(string="Image")
    active = fields.Boolean(string="Active", default=True)
    odoo_categ_id = fields.Many2one(
        comodel_name="product.category",
        string="Odoo Category (auto)",
        ondelete="set null",
        copy=False,
        help="Native Odoo product category auto-created to mirror this storefront category "
             "(used for standard Odoo reports / inventory grouping).",
    )

    def _get_or_create_odoo_categ(self):
        """Return the mirrored native product.category, creating it (and parents) if needed."""
        self.ensure_one()
        Categ = self.env["product.category"].sudo()
        if self.odoo_categ_id:
            if self.odoo_categ_id.name != self.name:
                self.odoo_categ_id.name = self.name
            return self.odoo_categ_id
        parent = self.parent_id._get_or_create_odoo_categ() if self.parent_id else False
        vals = {"name": self.name}
        if parent:
            vals["parent_id"] = parent.id
        categ = Categ.create(vals)
        self.sudo().odoo_categ_id = categ.id
        return categ

    @api.depends("name", "parent_id.complete_name")
    def _compute_complete_name(self):
        for category in self:
            if category.parent_id:
                category.complete_name = "%s / %s" % (
                    category.parent_id.complete_name,
                    category.name,
                )
            else:
                category.complete_name = category.name

    @api.constrains("parent_id")
    def _check_parent_recursion(self):
        for category in self:
            parent = category.parent_id
            while parent:
                if parent.id == category.id:
                    raise ValidationError(
                        _("You cannot create recursive categories.")
                    )
                parent = parent.parent_id
