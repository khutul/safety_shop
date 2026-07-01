# -*- coding: utf-8 -*-
from odoo import api, fields, models, _
from odoo.exceptions import ValidationError


class SafetyCatalogCategory(models.Model):
    _name = "safety.catalog.category"
    _description = "Storefront Category"
    _parent_name = "parent_id"
    _parent_store = True
    _order = "complete_name"

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
