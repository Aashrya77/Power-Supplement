import React, { useState } from 'react';
import './FAQ.css';
import { FaChevronDown } from 'react-icons/fa';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqData = [
    {
      category: 'General Questions',
      items: [
        {
          question: 'What is Power Supplement?',
          answer: 'Power Supplement is a leading provider of premium sports nutrition and fitness supplements. We offer a wide range of products including pre-workouts, protein powders, fat burners, amino acids, and recovery supplements designed to support your fitness goals.'
        },
        {
          question: 'Are your products safe?',
          answer: 'Yes, all our products are manufactured in facilities that comply with cGMP (Current Good Manufacturing Practices) standards and are third-party tested for quality and purity. We only use high-quality ingredients from trusted suppliers.'
        },
        {
          question: 'Where are your products manufactured?',
          answer: 'Our products are manufactured by certified facilities that follow strict quality control standards. All manufacturing facilities are FDA registered and comply with international quality standards.'
        },
        {
          question: 'Do you offer international shipping?',
          answer: 'Yes, we ship to select international destinations. Shipping costs and delivery times vary by location. International orders may be subject to customs duties and taxes. Contact our support team for specific international shipping inquiries.'
        }
      ]
    },
    {
      category: 'Products & Ingredients',
      items: [
        {
          question: 'What are the main ingredients in your products?',
          answer: 'Our products contain scientifically-researched ingredients designed to support specific fitness goals. Each product label lists all ingredients with their quantities. Visit individual product pages for detailed ingredient information.'
        },
        {
          question: 'Are your products suitable for vegetarians/vegans?',
          answer: 'We offer a range of products suitable for different dietary preferences. Check individual product pages for vegetarian and vegan options. Look for the vegetarian/vegan certification badge on product listings.'
        },
        {
          question: 'Do you use artificial sweeteners?',
          answer: 'Some of our products contain artificial sweeteners while others use natural sweeteners. Check the ingredient list on each product page to see which sweetening agents are used. We clearly label all ingredients.'
        },
        {
          question: 'Can I mix different products together?',
          answer: 'Most of our products can be combined, but we recommend consulting the product instructions or contacting our support team for specific combinations to ensure optimal results and safety.'
        }
      ]
    },
    {
      category: 'Ordering & Shipping',
      items: [
        {
          question: 'How long does shipping take?',
          answer: 'Standard shipping typically takes 3-5 business days. Express shipping takes 1-2 business days, and overnight shipping delivers the next business day. Shipping times are calculated from the order processing date.'
        },
        {
          question: 'Do you offer free shipping?',
          answer: 'Yes! We offer free standard shipping on orders over NPR 5,000 within Nepal. Free shipping does not apply to express or overnight shipping options.'
        },
        {
          question: 'Can I track my order?',
          answer: 'Yes, once your order ships, you will receive a tracking number via email. You can use this number to track your package in real-time on the carrier\'s website.'
        },
        {
          question: 'What if my order arrives damaged?',
          answer: 'If your package arrives damaged, please contact us immediately at support@powersupplement.net with photos of the damage. We will file a claim with the carrier and send you a replacement or refund.'
        },
        {
          question: 'Can I change my shipping address after ordering?',
          answer: 'You can change your shipping address within 24 hours of placing your order. Contact our support team immediately if you need to make changes. We cannot guarantee address changes after your order has been handed off to the carrier.'
        }
      ]
    },
    {
      category: 'Returns & Refunds',
      items: [
        {
          question: 'What is your refund policy?',
          answer: 'We offer a 100% money back guarantee on all products. If you\'re not satisfied within 30 days of purchase, we\'ll refund your money. The product must be in its original, unopened packaging.'
        },
        {
          question: 'How do I request a refund?',
          answer: 'Contact our support team at support@powersupplement.net with your order number. We\'ll provide return instructions and a shipping address. Once we receive and inspect the product, your refund will be processed within 5-7 business days.'
        },
        {
          question: 'Who pays for return shipping?',
          answer: 'Return shipping is typically the customer\'s responsibility unless the return is due to our error or a defective product. In those cases, we cover return shipping costs.'
        },
        {
          question: 'Can I return opened products?',
          answer: 'We cannot accept returns on opened or used products. All returned items must be in their original, unopened packaging to qualify for a refund.'
        }
      ]
    },
    {
      category: 'Payment & Security',
      items: [
        {
          question: 'What payment methods do you accept?',
          answer: 'We accept multiple payment methods including credit cards, debit cards, and eSewa. All payments are processed securely through encrypted connections.'
        },
        {
          question: 'Is my payment information secure?',
          answer: 'Yes, all transactions are processed through secure, encrypted connections. We do not store full credit card information on our servers. Your payment data is protected by industry-standard security measures.'
        },
        {
          question: 'Why was my payment declined?',
          answer: 'Payments may be declined for various reasons including insufficient funds, incorrect card details, or security flags. Please verify your payment information and try again. Contact your bank if issues persist.'
        },
        {
          question: 'Do you offer payment plans?',
          answer: 'Currently, we do not offer payment plans. However, we regularly run promotions and discounts. Subscribe to our newsletter to stay updated on special offers.'
        }
      ]
    },
    {
      category: 'Account & Profile',
      items: [
        {
          question: 'How do I create an account?',
          answer: 'Click on "Login/Register" in the footer or navigation menu. Select "Register" and fill in your email, password, and personal information. You\'ll receive a confirmation email to verify your account.'
        },
        {
          question: 'How do I reset my password?',
          answer: 'On the login page, click "Forgot Password" and enter your email address. You\'ll receive an email with instructions to reset your password.'
        },
        {
          question: 'Can I view my order history?',
          answer: 'Yes, log into your account and go to "My Orders" to view all your past purchases, tracking information, and order details.'
        },
        {
          question: 'How do I update my profile information?',
          answer: 'Log into your account and go to "Account Settings" to update your personal information, address, and contact details.'
        }
      ]
    },
    {
      category: 'Health & Fitness',
      items: [
        {
          question: 'Are these supplements safe for beginners?',
          answer: 'Most of our products are suitable for beginners, but we recommend starting with lower doses and consulting with a healthcare professional before beginning any supplement regimen.'
        },
        {
          question: 'Can I take multiple supplements together?',
          answer: 'Many supplements can be combined, but we recommend consulting with a healthcare professional or nutritionist to ensure safe and effective combinations for your specific needs.'
        },
        {
          question: 'Are these products tested for banned substances?',
          answer: 'Our products are manufactured in certified facilities and undergo quality testing. However, we recommend consulting with your sports organization regarding specific banned substance policies.'
        },
        {
          question: 'Do you provide nutrition or fitness advice?',
          answer: 'While we provide general product information, we recommend consulting with qualified healthcare professionals or certified nutritionists for personalized nutrition and fitness advice.'
        }
      ]
    },
    {
      category: 'Contact & Support',
      items: [
        {
          question: 'How can I contact customer support?',
          answer: 'You can reach our support team via email at support@powersupplement.net or through the contact form on our website. We typically respond within 24 business hours.'
        },
        {
          question: 'What are your business hours?',
          answer: 'Our customer support team is available Monday through Friday, 9 AM to 6 PM (Nepal Standard Time). We respond to emails and inquiries during these hours.'
        },
        {
          question: 'Do you have a physical store?',
          answer: 'Yes, we have multiple store locations throughout Nepal. Visit our "Store Locations" page to find the nearest store to you.'
        },
        {
          question: 'Can I get a refund on clearance items?',
          answer: 'Clearance and final sale items are generally not eligible for refunds unless they are defective. Check the product page for specific return policies on sale items.'
        }
      ]
    }
  ];

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="faq-page">
      <div className="faq-container">
        <h1>Frequently Asked Questions</h1>
        <p className="faq-intro">
          Find answers to common questions about our products, shipping, returns, and more.
        </p>

        <div className="faq-categories">
          {faqData.map((category, categoryIndex) => (
            <div key={categoryIndex} className="faq-category">
              <h2 className="category-title">{category.category}</h2>
              <div className="faq-items">
                {category.items.map((item, itemIndex) => {
                  const globalIndex = `${categoryIndex}-${itemIndex}`;
                  const isActive = activeIndex === globalIndex;

                  return (
                    <div key={itemIndex} className="faq-item">
                      <button
                        className={`faq-question ${isActive ? 'active' : ''}`}
                        onClick={() => toggleAccordion(globalIndex)}
                      >
                        <span>{item.question}</span>
                        <FaChevronDown className={`chevron ${isActive ? 'rotated' : ''}`} />
                      </button>
                      {isActive && (
                        <div className="faq-answer">
                          <p>{item.answer}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="faq-contact">
          <h3>Didn't find your answer?</h3>
          <p>
            If you couldn't find the answer you're looking for, please don't hesitate to contact our support team.
          </p>
          <a href="/contact" className="contact-btn">Contact Us</a>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
