import React from 'react';
import './Legal.css';

const RefundPolicy = () => {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <h1>Refund Policy</h1>
        <div className="legal-content">
          <section>
            <h2>100% Money Back Guarantee</h2>
            <p>
              At Power Supplement, we stand behind the quality of our products. If you're not completely satisfied with your purchase, we offer a hassle-free 100% money back guarantee.
            </p>
          </section>

          <section>
            <h2>Refund Eligibility</h2>
            <p>
              To be eligible for a refund, the following conditions must be met:
            </p>
            <ul>
              <li>The product must be returned within 30 days of purchase</li>
              <li>The product must be in its original, unopened packaging</li>
              <li>The product must not show signs of use or damage</li>
              <li>A valid proof of purchase (receipt or order confirmation) must be provided</li>
              <li>The product must not be expired</li>
            </ul>
          </section>

          <section>
            <h2>How to Request a Refund</h2>
            <p>
              To request a refund, please follow these steps:
            </p>
            <ol>
              <li>Contact our customer service team at support@powersupplement.net</li>
              <li>Provide your order number and reason for the refund</li>
              <li>Include photos of the product and packaging if requested</li>
              <li>Wait for approval from our team (typically within 2-3 business days)</li>
              <li>Ship the product back to us at your own expense</li>
              <li>Once received and inspected, your refund will be processed within 5-7 business days</li>
            </ol>
          </section>

          <section>
            <h2>Return Shipping Address</h2>
            <p>
              Please contact our customer service team for the return shipping address. Shipping costs are the responsibility of the customer unless the return is due to our error or a defective product.
            </p>
          </section>

          <section>
            <h2>Exceptions to Refund Policy</h2>
            <p>
              The following items are not eligible for refund:
            </p>
            <ul>
              <li>Products that have been opened or used</li>
              <li>Products purchased more than 30 days ago</li>
              <li>Products without proof of purchase</li>
              <li>Products that are damaged due to customer mishandling</li>
              <li>Expired products</li>
              <li>Clearance or final sale items (unless defective)</li>
            </ul>
          </section>

          <section>
            <h2>Defective Products</h2>
            <p>
              If you receive a defective or damaged product, please contact us immediately. We will arrange for a replacement or full refund at no additional cost to you, including return shipping.
            </p>
          </section>

          <section>
            <h2>Refund Processing</h2>
            <p>
              Refunds will be credited to the original payment method used for the purchase. Please allow 5-7 business days for the refund to appear in your account. Some financial institutions may take an additional 1-2 business days to process the credit.
            </p>
          </section>

          <section>
            <h2>Questions?</h2>
            <p>
              If you have any questions about our refund policy, please contact us at support@powersupplement.net or call our customer service team.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;
