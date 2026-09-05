/** @odoo-module **/
import { PaymentInterface } from "@point_of_sale/app/utils/payment/payment_interface";
import { register_payment_method } from "@point_of_sale/app/services/pos_store";
import { rpc } from "@web/core/network/rpc";
import { _t } from "@web/core/l10n/translation";
import { AlertDialog } from "@web/core/confirmation_dialog/confirmation_dialog";
import { QpayQrDialog } from "@safety_pos_qpay/app/qpay_qr_dialog";

export class PaymentQPay extends PaymentInterface {
    // Auto-show the QR the moment the cashier selects "QPay QR".
    get fastPayments() {
        return true;
    }

    /**
     * Called (via line.pay()) when a QPay payment line needs processing.
     * Creates a QPay invoice for the line amount, shows the QR, and resolves
     * true once QPay confirms payment (false on cancel/failure).
     */
    async sendPaymentRequest(uuid) {
        await super.sendPaymentRequest(...arguments);
        const order = this.pos.getOrder();
        const line = order.getSelectedPaymentline();
        if (!line) {
            return false;
        }
        line.setPaymentStatus("waiting");

        let inv;
        try {
            inv = await rpc("/pos/qpay/invoice", {
                amount: line.amount,
                reference: order.name || order.uuid || "POS",
            });
        } catch (e) {
            this._alert(_t("QPay холболт амжилтгүй боллоо."));
            line.setPaymentStatus("retry");
            return false;
        }
        if (!inv || !inv.ok) {
            this._alert((inv && inv.error) || _t("QPay алдаа гарлаа."));
            line.setPaymentStatus("retry");
            return false;
        }

        const paid = await new Promise((resolve) => {
            this.env.services.dialog.add(QpayQrDialog, {
                qrImage: inv.qr_image,
                amount: inv.amount,
                invoiceId: inv.invoice_id,
                shortUrl: inv.short_url || "",
                onPaid: () => resolve(true),
                onCancel: () => resolve(false),
            });
        });

        if (paid) {
            line.setPaymentStatus("done");
            return true;
        }
        line.setPaymentStatus("retry");
        return false;
    }

    async sendPaymentCancel(order, uuid) {
        await super.sendPaymentCancel(...arguments);
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
