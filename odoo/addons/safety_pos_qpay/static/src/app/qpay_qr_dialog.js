/** @odoo-module **/
import { Component, useState, onWillStart, onWillUnmount } from "@odoo/owl";
import { Dialog } from "@web/core/dialog/dialog";
import { rpc } from "@web/core/network/rpc";

export class QpayQrDialog extends Component {
    static template = "safety_pos_qpay.QpayQrDialog";
    static components = { Dialog };
    static props = {
        qrImage: String,
        amount: Number,
        invoiceId: String,
        shortUrl: { type: String, optional: true },
        onPaid: Function,
        onCancel: Function,
        close: Function, // injected by the dialog service
    };

    setup() {
        this.state = useState({ checking: false, paid: false });
        this._timer = null;
        onWillStart(() => {
            // Poll QPay every 3s for payment confirmation.
            this._timer = setInterval(() => this._check(), 3000);
        });
        onWillUnmount(() => this._stop());
    }

    _stop() {
        if (this._timer) {
            clearInterval(this._timer);
            this._timer = null;
        }
    }

    async _check() {
        if (this.state.checking || this.state.paid) {
            return;
        }
        this.state.checking = true;
        try {
            const r = await rpc("/pos/qpay/check", {
                invoice_id: this.props.invoiceId,
                amount: this.props.amount,
            });
            if (r && r.ok && r.paid) {
                this.state.paid = true;
                this._stop();
                this.props.onPaid();
                this.props.close();
            }
        } catch (e) {
            // network hiccup — keep polling
        } finally {
            this.state.checking = false;
        }
    }

    fmt(n) {
        return (n || 0).toLocaleString("mn-MN") + "₮";
    }

    onCancel() {
        this._stop();
        this.props.onCancel();
        this.props.close();
    }
}
