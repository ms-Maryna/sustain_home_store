import React from "react"
import {SERVER_HOST} from "../config/global_constants"

const formatDate = date => date ? new Date(date).toLocaleDateString("en-IE", {day: "2-digit", month: "short", year: "numeric"}) : "—"

// how many of one product have a return with this status
const returnQty = (order, productId, status) =>
    (order.returns || [])
        .filter(r => r.productId === productId && r.status === status)
        .reduce((sum, r) => sum + r.qty, 0)


// Full details of one order, shown in the admin Purchases page.
// props: order, onProcessReturn(purchaseId, returnId, status)
export const OrderDetails = ({order, onProcessReturn}) =>
{
    const imageOf = productId =>
    {
        const item = order.items.find(i => i.productId === productId)
        return item && item.image ? `${SERVER_HOST}/uploads/products/${item.image}` : null
    }

    const returns = order.returns || []

    return (
        <div className="orderDetails">

            {/* ===== customer / delivery / payment ===== */}
            <div className="orderInfoGrid">
                <div className="orderInfoCard">
                    <h4>Customer</h4>
                    <p className="orderInfoMain">{order.customer.name}</p>
                    <p>{order.customer.email}</p>
                    <p>{order.customer.phone}</p>
                    <p className="orderInfoMuted">{order.userEmail ? "Registered customer" : "Guest checkout"}</p>
                </div>

                <div className="orderInfoCard">
                    <h4>Delivery address</h4>
                    <p className="orderInfoMain">{order.customer.address}</p>
                </div>

                <div className="orderInfoCard">
                    <h4>Payment</h4>
                    <p><span className={"statusPill status" + order.status}>{order.status === "Pending" ? "Not paid" : order.status}</span></p>
                    <p>Ordered: {formatDate(order.date)}</p>
                    {order.paidAt ? <p>Paid: {formatDate(order.paidAt)}</p> : null}
                    {order.paypalOrderId ? <p className="orderInfoMuted">PayPal ID: {order.paypalOrderId}</p> : null}
                </div>
            </div>

            {/* ===== products ===== */}
            <h4 className="orderSectionTitle">Products</h4>
            <div className="orderItems">
                {order.items.map(item =>
                {
                    const returned = returnQty(order, item.productId, "Approved")
                    const requested = returnQty(order, item.productId, "Requested")
                    return (
                        <div key={item.productId} className="orderItem">
                            {item.image ?
                                <img src={`${SERVER_HOST}/uploads/products/${item.image}`} alt=""/>
                            :
                                <div className="orderItemNoImg"/>
                            }
                            <div className="orderItemName">
                                <b>{item.name}</b>
                                <span>€{item.price.toFixed(2)} each</span>
                            </div>
                            <div className="orderItemQty">
                                x {item.qty}
                                {returned > 0 ? <span className="statusPill statusApproved">{returned} returned</span> : null}
                                {requested > 0 ? <span className="statusPill statusRequested">{requested} return requested</span> : null}
                            </div>
                            <div className="orderItemTotal">€{(item.price * item.qty).toFixed(2)}</div>
                        </div>
                    )
                })}
                <div className="orderTotalRow">
                    <span>Total</span>
                    <b>€{order.total.toFixed(2)}</b>
                </div>
            </div>

            {/* ===== returns ===== */}
            <h4 className="orderSectionTitle">Return requests ({returns.length})</h4>

            {returns.length === 0 ?
                <p className="orderInfoMuted">No return requests for this order.</p>
            :
                <div className="returnCards">
                    {returns.map(r =>
                        <div key={r._id} className={"returnCard returnCard" + r.status}>

                            <div className="returnCardHeader">
                                {imageOf(r.productId) ? <img src={imageOf(r.productId)} alt=""/> : null}
                                <div>
                                    <b>{r.qty} x {r.name}</b>
                                    <span className="orderInfoMuted">Requested {formatDate(r.date)}</span>
                                </div>
                                <span className={"statusPill status" + r.status}>{r.status}</span>
                            </div>

                            <div className="returnReason">
                                <span>Reason</span>
                                <p>{r.reason}</p>
                            </div>

                            {r.status === "Requested" ?
                                <div className="returnActions">
                                    <button className="green-button" onClick={() => onProcessReturn(order._id, r._id, "Approved")}>Approve return</button>
                                    <button className="red-button" onClick={() => onProcessReturn(order._id, r._id, "Rejected")}>Reject</button>
                                </div>
                            :
                                <p className="orderInfoMuted">
                                    {r.status === "Approved" ? `${r.qty} item(s) were added back to stock.` : "This return was rejected."}
                                </p>
                            }
                        </div>
                    )}
                </div>
            }

        </div>
    )
}
