import React from 'react';
import './Legal.css';

const ShippingPolicy = () => {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <h1>Shipping Policy</h1>
        <div className="legal-content">
          <section>
            <h2>Shipping Information</h2>
            <p>
              Power Supplement is committed to delivering your orders quickly and safely. We ship to locations throughout Nepal and select international destinations.
            </p>
          </section>

          <section>
            <h2>Shipping Methods</h2>
            <p>
              We offer the following shipping options:
            </p>
            <ul>
              <li><strong>Standard Shipping:</strong> 3-5 business days</li>
              <li><strong>Express Shipping:</strong> 1-2 business days</li>
              <li><strong>Overnight Shipping:</strong> Next business day delivery</li>
            </ul>
          </section>

          <section>
            <h2>Shipping Rates</h2>
            <p>
              Shipping rates are calculated based on:
            </p>
            <ul>
              <li>Order weight and dimensions</li>
              <li>Destination address</li>
              <li>Selected shipping method</li>
              <li>Current carrier rates</li>
            </ul>
            <p>
              Shipping costs will be displayed at checkout before you complete your purchase.
            </p>
          </section>

          <section>
            <h2>Free Shipping</h2>
            <p>
              We offer free standard shipping on orders over NPR 5,000 within Nepal. Free shipping does not apply to express or overnight shipping options.
            </p>
          </section>

          <section>
            <h2>Processing Time</h2>
            <p>
              Orders are typically processed within 1-2 business days. During peak seasons or promotional periods, processing may take up to 3 business days. Processing time does not include weekends or holidays.
            </p>
          </section>

          <section>
            <h2>Order Tracking</h2>
            <p>
              Once your order ships, you will receive a tracking number via email. You can use this number to track your package in real-time on the carrier's website.
            </p>
          </section>

          <section>
            <h2>Delivery Confirmation</h2>
            <p>
              All shipments require a signature upon delivery. If you're not available to receive your package, the carrier will leave a notice and attempt redelivery.
            </p>
          </section>

          <section>
            <h2>International Shipping</h2>
            <p>
              We ship to select international destinations. International orders may be subject to customs duties and taxes, which are the responsibility of the recipient. Delivery times for international orders are typically 7-14 business days.
            </p>
          </section>

          <section>
            <h2>Lost or Damaged Packages</h2>
            <p>
              If your package arrives damaged or is lost in transit, please contact us immediately at support@powersupplement.net with photos of the damage or proof of non-delivery. We will work with the carrier to file a claim and send you a replacement or refund.
            </p>
          </section>

          <section>
            <h2>Address Changes</h2>
            <p>
              If you need to change your shipping address, please contact us within 24 hours of placing your order. We cannot guarantee address changes after your order has been processed and handed off to the carrier.
            </p>
          </section>

          <section>
            <h2>Shipping Restrictions</h2>
            <p>
              Some products may have shipping restrictions due to their nature or local regulations. These restrictions will be noted during checkout. We cannot ship to P.O. boxes or military addresses.
            </p>
          </section>

          <section>
            <h2>Contact Us</h2>
            <p>
              For any shipping-related questions or concerns, please contact our customer service team at support@powersupplement.net
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ShippingPolicy;
