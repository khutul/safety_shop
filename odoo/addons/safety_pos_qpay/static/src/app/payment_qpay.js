/** @odoo-module **/
import { PaymentInterface } from "@point_of_sale/app/payment/payment_interface";
import { register_payment_method } from "@point_of_sale/app/store/pos_store";
import { rpc } from "@web/core/network/rpc";
import { _t } from "@web/core/l10n/translation";
import { AlertDialog } from "@web/core/confirmation_dialog/confirmation_dialog";
import { QpayQrDialog } from "@safety_pos_qpay/app/qpay_qr_dialog";

export class PaymentQPay extends PaymentInterface {
    /**
     * Called when the cashier presses "Send" on a QPay payment line.
     * Creates a QPay invoice for the line amount, shows the QR, and resolves
     * true once QPay confirms the payment (or false if cancelled/failed).
     */
    async send_payment_request(uuid) {
        const order = this.pos.get_order();
        const line = order.get_selected_paymentline();
        if (!line) {
            return false;
        }
        const amount = line.get_amount();
        let inv;
        try {
            inv = await rpc("/pos/qpay/invoice", {
                amount: amount,
                reference: order.name || order.uuid || "POS",
            });
        } catch (e) {
            this._alert(_t("QPay холболт амжилтгүй боллоо."));
            return false;
        }
        if (!inv || !inv.ok) {
            this._alert((inv && inv.error) || _t("QPay алдаа гарлаа."));
            return false;
        }

        return await new Promise((resolve) => {
            this.env.services.dialog.add(QpayQrDialog, {
                qrImage: inv.qr_image,
                amount: inv.amount,
                invoiceId: inv.invoice_id,
                shortUrl: inv.short_url || "",
                onPaid: () => resolve(true),
                onCancel: () => resolve(false),
            });
        });
    }

    async send_payment_cancel(order, uuid) {
        // Nothing server-side to cancel; the invoice simply expires unpaid.
        return true;
    }

    _alert(message) {
        this.env.services.dialog.add(AlertDialog, {
            title: _t("QPay"),
            body: message,
        });
    }
}

register_payment_method("qpay", PaymentQPay);
