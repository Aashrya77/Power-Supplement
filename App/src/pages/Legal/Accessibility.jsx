import React from 'react';
import './Legal.css';

const Accessibility = () => {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <h1>Accessibility Statement</h1>
        <div className="legal-content">
          <section>
            <h2>Our Commitment to Accessibility</h2>
            <p>
              Power Supplement is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards.
            </p>
          </section>

          <section>
            <h2>Accessibility Features</h2>
            <p>
              Our website includes the following accessibility features:
            </p>
            <ul>
              <li>Keyboard navigation support throughout the site</li>
              <li>Alt text for all images</li>
              <li>Semantic HTML structure for screen reader compatibility</li>
              <li>High contrast color options</li>
              <li>Resizable text and zoom functionality</li>
              <li>Descriptive link text</li>
              <li>Form labels and error messages</li>
              <li>Video captions and transcripts</li>
            </ul>
          </section>

          <section>
            <h2>WCAG Compliance</h2>
            <p>
              We strive to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards. These guidelines explain how to make web content more accessible to people with disabilities.
            </p>
          </section>

          <section>
            <h2>Assistive Technology Support</h2>
            <p>
              Our website is designed to work with the following assistive technologies:
            </p>
            <ul>
              <li>Screen readers (NVDA, JAWS, VoiceOver)</li>
              <li>Voice recognition software</li>
              <li>Text enlargement software</li>
              <li>Speech-to-text applications</li>
            </ul>
          </section>

          <section>
            <h2>Keyboard Navigation</h2>
            <p>
              You can navigate our website using the following keyboard shortcuts:
            </p>
            <ul>
              <li><strong>Tab:</strong> Move to the next interactive element</li>
              <li><strong>Shift + Tab:</strong> Move to the previous interactive element</li>
              <li><strong>Enter:</strong> Activate buttons and links</li>
              <li><strong>Space:</strong> Activate buttons and checkboxes</li>
              <li><strong>Arrow Keys:</strong> Navigate within menus and lists</li>
            </ul>
          </section>

          <section>
            <h2>Known Accessibility Issues</h2>
            <p>
              While we strive to make our website fully accessible, we recognize that some areas may not yet meet all accessibility standards. We are actively working to address these issues and appreciate your feedback.
            </p>
          </section>

          <section>
            <h2>Accessibility Tools</h2>
            <p>
              We recommend using the following tools to enhance your browsing experience:
            </p>
            <ul>
              <li>Browser zoom functionality (Ctrl/Cmd + Plus to increase size)</li>
              <li>Operating system accessibility settings</li>
              <li>Browser extensions for accessibility</li>
            </ul>
          </section>

          <section>
            <h2>Report Accessibility Issues</h2>
            <p>
              If you encounter any accessibility barriers on our website, please let us know. We welcome your feedback and will work to resolve the issue as quickly as possible.
            </p>
            <p>
              <strong>Email:</strong> accessibility@powersupplement.net<br />
              <strong>Phone:</strong> Contact our support team for accessibility assistance
            </p>
          </section>

          <section>
            <h2>Third-Party Content</h2>
            <p>
              While we strive to ensure all content on our website is accessible, some third-party content (such as embedded videos or external links) may not meet accessibility standards. We encourage you to contact us if you have difficulty accessing any third-party content.
            </p>
          </section>

          <section>
            <h2>Continuous Improvement</h2>
            <p>
              We are committed to ongoing accessibility improvements. We regularly audit our website and implement updates to enhance accessibility for all users.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Accessibility;
