# -*- coding: utf-8 -*-
"""Хурдан тооллого — ажилтан бараагаа сонгоод хэмжээ тус бүрийн
үлдэгдлийг шууд бичээд хадгалдаг хялбар дэлгэц (команд шаардлагагүй)."""
from odoo import api, fields, models


class SafetyStockCount(models.TransientModel):
    _name = "safety.stock.count"
    _description = "Хурдан тооллого"

    product_tmpl_id = fields.Many2one(
        comodel_name="product.template",
        string="Бараа",
        required=True,
        domain=[("is_storable", "=", True)],
    )
    line_ids = fields.One2many(
        comodel_name="safety.stock.count.line",
        inverse_name="count_id",
        string="Хэмжээнүүд",
    )

    def _stock_location(self):
        loc = self.env.ref("stock.stock_location_stock", raise_if_not_found=False)
        if not loc:
            wh = self.env["stock.warehouse"].sudo().search([], limit=1)
            loc = wh.lot_stock_id
        return loc

    @api.onchange("product_tmpl_id")
    def _onchange_product(self):
        """Бараа сонгоход хэмжээ (variant) бүрийн одоогийн үлдэгдлийг гаргана."""
        lines = [(5, 0, 0)]
        for v in self.product_tmpl_id.product_variant_ids:
            on_hand = v.qty_available
            lines.append((0, 0, {
                "variant_id": v.id,
                "current_qty": on_hand,
                "counted_qty": on_hand,
            }))
        self.line_ids = lines

    def action_apply(self):
        """Бичсэн тоонуудыг агуулахын үлдэгдэлд шууд суулгана."""
        self.ensure_one()
        loc = self._stock_location()
        Quant = self.env["stock.quant"].sudo()
        n = 0
        for line in self.line_ids:
            if not line.variant_id:
                continue
            quant = Quant.search([
                ("product_id", "=", line.variant_id.id),
                ("location_id", "=", loc.id),
            ], limit=1)
            if quant:
                quant.inventory_quantity = line.counted_qty
            else:
                quant = Quant.create({
                    "product_id": line.variant_id.id,
                    "location_id": loc.id,
                    "inventory_quantity": line.counted_qty,
                })
            quant.action_apply_inventory()
            n += 1
        return {
            "type": "ir.actions.client",
            "tag": "display_notification",
            "params": {
                "title": "Тооллого хадгалагдлаа",
                "message": "%s хэмжээний үлдэгдэл шинэчлэгдлээ." % n,
                "type": "success",
                "next": {
                    "type": "ir.actions.act_window",
                    "res_model": "safety.stock.count",
                    "view_mode": "form",
                    "target": "current",
                    "views": [[False, "form"]],
                },
            },
        }


class SafetyStockCountLine(models.TransientModel):
    _name = "safety.stock.count.line"
    _description = "Хурдан тооллогын мөр"

    count_id = fields.Many2one("safety.stock.count", ondelete="cascade")
    variant_id = fields.Many2one(
        comodel_name="product.product",
        string="Хэмжээ / хувилбар",
        required=True,
    )
    variant_name = fields.Char(
        string="Бараа / хэмжээ",
        related="variant_id.display_name",
        readonly=True,
    )
    current_qty = fields.Float(string="Одоогийн үлдэгдэл", readonly=True)
    counted_qty = fields.Float(string="Шинэ тоо")
