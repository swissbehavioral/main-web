import { site } from "./site";

/**
 * Legal content (§Exhibit A #15–16).
 *
 * IMPORTANT — handover note: these are professionally structured starting
 * drafts that must be reviewed by the Client (and their counsel/compliance
 * advisor) before launch, and updated to reflect the Client's actual practices.
 * See docs/BUILD-PLAN.md §12 and the README launch checklist.
 */

export interface LegalBlock {
  p?: string;
  list?: string[];
}

export interface LegalSection {
  id: string;
  heading: string;
  blocks: LegalBlock[];
}

export interface LegalDoc {
  eyebrow: string;
  title: string;
  intro: string;
  updated: string;
  sections: LegalSection[];
}

const UPDATED = "October 1, 2026";

export const privacyDoc: LegalDoc = {
  "eyebrow": "Website privacy & cookies",
  "title": "Privacy Policy & Cookie Choices",
  "intro": "How we handle website inquiries, insurance requests, chat messages and browser storage \u2014 and the choices available to you.",
  "updated": "October 25, 2026",
  "sections": [
    {
      "id": "overview",
      "heading": "1. Who we are and what this policy covers",
      "blocks": [
        {
          "p": "Swiss Behavioral Health (SBH, we, us) operates this website for information about behavioral health services and for admissions inquiries. This policy explains website information handling, including forms, insurance requests, chat and browser storage. Health information may also be protected by HIPAA, substance use disorder confidentiality rules and other applicable laws. Its protection depends on the information and circumstances, not simply on which form you use."
        }
      ]
    },
    {
      "id": "collect",
      "heading": "2. Information collected through the website",
      "blocks": [
        {
          "list": [
            "Contact and inquiry details you submit: name, email, phone, preferred contact method, best time to contact you, inquiry reason and message.",
            "Insurance requests: contact details, insurer name and your permission to contact you. The current form does not request an insurance member ID.",
            "Chat: an anonymous visitor session when you open chat; name, email, consent and messages if you start a conversation. Messages and conversation history are stored on our server systems so authorized staff can respond.",
            "Submission context: source page, referring page and browser information. Hosting and infrastructure providers may process IP addresses, request logs and device information to deliver and protect the service.",
            "Internal service records: assigned staff, inquiry status, verification outcome and staff notes associated with your request."
          ]
        }
      ]
    },
    {
      "id": "sensitive-information",
      "heading": "3. Sharing sensitive information safely",
      "blocks": [
        {
          "p": "Use forms and chat for general inquiries. Please do not send medical records, diagnoses, medication lists, Social Security numbers, payment card information or insurance member IDs. Ask admissions for an appropriate way to share documents. If you include health details anyway, they are received and stored with your inquiry; this warning does not remove protections that may apply to that information."
        },
        {
          "p": "Chat and forms are not emergency services and may not receive an immediate response. Submitting a request does not establish a treatment relationship. An insurance request is not confirmation of eligibility, benefits, authorization, admission or payment."
        }
      ]
    },
    {
      "id": "use",
      "heading": "4. How information is used",
      "blocks": [
        {
          "list": [
            "Respond to your request using the contact details and preferences you provide.",
            "Review insurance inquiries and coordinate admissions next steps that you request.",
            "Assign inquiries and conversations to authorized staff and maintain a record of follow-up.",
            "Authenticate staff, operate chat, prevent abuse, troubleshoot problems and meet applicable recordkeeping or legal obligations."
          ]
        },
        {
          "p": "Permission to respond to an inquiry is separate from cookie choices and is not consent to unrelated marketing."
        }
      ]
    },
    {
      "id": "sharing",
      "heading": "5. Who may receive information",
      "blocks": [
        {
          "p": "Authorized staff access inquiries and conversations according to their roles. Our website uses Appwrite for backend storage, authentication and chat infrastructure, together with hosting services. These providers process information needed to operate those services. Relevant information may be shared with an insurer or another service participant as needed for your request and where permitted or authorized. Disclosures required by law remain subject to any applicable health record confidentiality restrictions."
        },
        {
          "p": "The current website has no advertising pixels, analytics trackers or automated advertising audience integrations. We do not sell website inquiry or chat information through this website. External services linked from the site have their own privacy practices."
        }
      ]
    },
    {
      "id": "cookies",
      "heading": "6. Cookies, browser storage and third-party services",
      "blocks": [
        {
          "list": [
            "sbh_cookie_preferences \u2014 first-party cookie storing your external-media choice, preference version and choice time for 180 days. It contains no inquiry or chat message.",
            "sbh_chat_session \u2014 first-party, HttpOnly visitor session cookie set when you open chat, lasting up to 7 days. It connects your browser to your chat history. Closing the chat does not delete the session or stored messages.",
            "sbh_admin_session \u2014 first-party, HttpOnly staff authentication cookie lasting up to 8 hours. It is used for staff sign-in, not ordinary browsing.",
            "sbh-notice-dismissed \u2014 sessionStorage preference used after you dismiss the website notice; it lasts for the browser tab session.",
            "Google Maps \u2014 optional external media. No map iframe is loaded until you accept optional media or use the explicit allow-and-load button. Once loaded, Google receives connection information and may use cookies under its own policy.",
            "Website fonts are hosted on this website; loading them does not send a request to Google Fonts."
          ]
        },
        {
          "p": "Use Cookie preferences in the footer to accept, reject or change optional media at any time. Rejecting optional media does not prevent browsing, forms or chat you choose to open. Turning media off removes loaded maps; it cannot delete cookies already placed by another domain. You can remove those through your browser controls. Blocking essential cookies can prevent chat continuity or staff sign-in. If your browser cannot store a choice, the choice applies for the current visit and you may be asked again."
        }
      ]
    },
    {
      "id": "retention",
      "heading": "7. How long information is kept",
      "blocks": [
        {
          "p": "Browser cookie durations above do not determine how long server-side inquiry, chat or account records are retained. Records may be needed for follow-up, operational records and applicable legal requirements. The system does not automatically purge inquiries or chats when a cookie expires. Marking a lead deleted in the dashboard is a recoverable administrative action, not immediate erasure from storage or backups. Contact us about a specific record or deletion request; retention obligations may limit what can be removed."
        }
      ]
    },
    {
      "id": "security",
      "heading": "8. Security and service locations",
      "blocks": [
        {
          "p": "The application uses staff authentication, role-based access and server-side access checks to restrict administrative records. Session cookies are HttpOnly and configured as Secure in production. Use the HTTPS production website when submitting information. No online service can promise absolute security. Hosting and service providers may process information outside your state or country; contact us if you need information about a particular service arrangement before sending sensitive documents."
        }
      ]
    },
    {
      "id": "choices",
      "heading": "9. Access, correction and privacy requests",
      "blocks": [
        {
          "p": "Contact us to ask about access to, correction of or deletion of website inquiry information, to change your preferred contact method, or to raise a concern. We may need to verify your identity without asking you to post sensitive identifiers in website chat. Requests are handled subject to applicable law, identity verification and record retention obligations. Additional health record rights may apply separately. Cookie acceptance does not waive any privacy right."
        }
      ]
    },
    {
      "id": "children",
      "heading": "10. Children and requests made for someone else",
      "blocks": [
        {
          "p": "This website is not directed to children under 13. Children under 13 should not submit personal information through the website. If you believe a child has done so, contact us. If you inquire on someone else\u2019s behalf, share only information you are authorized to provide; our team may need to verify authority before discussing that person\u2019s information."
        }
      ]
    },
    {
      "id": "updates",
      "heading": "11. Updates",
      "blocks": [
        {
          "p": "We may revise this policy when website features, providers or information practices change. The revision date identifies this website policy version. A material change to optional storage purposes will require a new preference choice. Changes to a healthcare notice have their own effective date and requirements."
        }
      ]
    },
    {
      "id": "contact",
      "heading": "12. Contact and healthcare privacy notices",
      "blocks": [
        {
          "p": `For website privacy questions or a request about your information, contact ${site.email.display}, ${site.phone.display}, or write to ${site.address.full}; ask for the person responsible for privacy. Avoid sending medical records or sensitive identifiers in ordinary email. The healthcare notice below explains additional protections for health information and how to exercise your privacy rights.`
        }
      ]
    }
  ]
};

export const nppDoc: LegalDoc = {
  eyebrow: "Notice of Privacy Practices",
  title: "Healthcare Privacy Notice",
  intro:
    "This notice explains how health information may be used and shared, the protections that apply to substance use disorder records, and how you can exercise your privacy rights.",
  updated: "October 25, 2026",
  sections: [
    {
      id: "npp-completion",
      heading: "Privacy contact",
      blocks: [{ list: ["Swiss Behavioral Health — ask for the person responsible for privacy.", `Email: ${site.email.display}`, `Telephone: ${site.phone.display}`, `Mail: ${site.address.full}`] }],
    },
    {
      id: "npp-about",
      heading: "1. About this notice",
      blocks: [
        {
          p: "This Notice of Privacy Practices applies to health information created or received by Swiss Behavioral Health in the course of providing treatment. Information received through website forms or chat may also be protected when it qualifies as protected health information or a protected substance use disorder record. The submission channel alone does not determine its legal protection.",
        },
      ],
    },
    {
      id: "npp-treatment",
      heading: "2. How we may use and disclose health information",
      blocks: [
        {
          list: [
            "Treatment — to provide, coordinate and manage your care, including sharing information with treating clinicians and, where appropriate and permitted, with family members involved in your care.",
            "Payment — to bill and obtain payment for services, including communicating with your insurer where you have authorised it.",
            "Health care operations — for activities such as quality review, staff training and business management.",
          ],
        },
      ],
    },
    {
      id: "npp-part-two",
      heading: "Substance use disorder record protections",
      blocks: [{ p: "Where 42 CFR Part 2 applies, most identifiable substance use disorder record disclosures require consent or a specific legal exception. A qualifying consent may cover future treatment, payment and healthcare operations; HIPAA-regulated recipients may redisclose under HIPAA subject to Part 2 limits. Records cannot be used in proceedings against you without the required consent or qualifying court order and legal process. A general request or subpoena alone does not remove these protections. You may decline fundraising communications. More protective state confidentiality laws continue to apply. Contact our privacy representative with questions about consent or to make a complaint." }],
    },
    {
      id: "npp-other",
      heading: "3. Other permitted or required disclosures",
      blocks: [
        {
          p: "We may disclose health information where required by law, such as to respond to a court order, to report suspected abuse or neglect, to address a serious and imminent threat to health or safety, or as otherwise permitted by applicable law, including the confidentiality rules that apply to substance use disorder records.",
        },
      ],
    },
    {
      id: "npp-authorisation",
      heading: "4. Disclosures requiring your authorisation",
      blocks: [
        {
          p: "Most uses and disclosures of psychotherapy notes, and most uses and disclosures for marketing or the sale of health information, require your written authorisation. You may revoke an authorisation in writing at any time, except to the extent we have already acted in reliance on it.",
        },
      ],
    },
    {
      id: "npp-rights",
      heading: "5. Your rights",
      blocks: [
        {
          list: [
            "Get a copy of your health record and request corrections.",
            "Request confidential communications by a specific method or at a specific location.",
            "Ask us to restrict certain uses or disclosures. When you pay in full out of pocket, you may require that information about that service is not shared with your health plan for payment or operations, unless disclosure is required by law. Other restrictions may not always be agreed to.",
            "Receive a list of disclosures we have made, where applicable.",
            "Receive a paper copy of this notice on request.",
            "Choose someone to act for you as your personal representative.",
          ],
        },
      ],
    },
    {
      id: "npp-duties",
      heading: "6. Our responsibilities",
      blocks: [
        {
          list: [
            "We are required by law to maintain the privacy and security of your health information.",
            "We will notify you promptly if a breach occurs that may have compromised the privacy or security of your information.",
            "We must follow the duties and privacy practices described in this notice and give you a copy of it.",
            "We will not use or share your information other than as described here unless you tell us in writing that we may.",
          ],
        },
      ],
    },
    {
      id: "npp-complaints",
      heading: "7. Complaints",
      blocks: [
        {
          p: `If you believe your privacy rights have been violated, you may file a complaint with us by contacting ${site.email.display} or ${site.phone.display}, or with the U.S. Department of Health and Human Services Office for Civil Rights. We will not retaliate against you for filing a complaint.`,
        },
      ],
    },
    {
      id: "npp-changes",
      heading: "8. Changes to this notice",
      blocks: [
        {
          p: "We reserve the right to change this notice and to make the revised notice effective for health information we already have as well as any information we receive in the future. The date at the top of this page reflects the most recent revision.",
        },
      ],
    },
  ],
};

export const termsDoc: LegalDoc = {
  eyebrow: "Terms of Use",
  title: "Terms of Use",
  intro:
    "These terms govern your use of the Swiss Behavioral Health website. By using this site, you agree to them.",
  updated: UPDATED,
  sections: [
    {
      id: "acceptance",
      heading: "1. Acceptance of terms",
      blocks: [
        {
          p: "By accessing or using this website you agree to be bound by these Terms of Use. If you do not agree, please do not use the site.",
        },
      ],
    },
    {
      id: "no-advice",
      heading: "2. Not medical advice; no provider relationship",
      blocks: [
        {
          p: "The content on this website is provided for general information only. It is not medical advice, diagnosis or treatment, and it does not create a clinician-patient or provider-patient relationship. Always seek the advice of a qualified professional about your situation.",
        },
      ],
    },
    {
      id: "emergency",
      heading: "3. Emergencies",
      blocks: [
        {
          p: "This website is not monitored for emergencies and must not be used to report a crisis. If you or someone else is in immediate danger, contact 911 or your local emergency service, or go to the nearest emergency department.",
        },
      ],
    },
    {
      id: "permitted-use",
      heading: "4. Permitted use",
      blocks: [
        {
          list: [
            "Use the site lawfully and only for its intended purpose.",
            "Do not submit medical records, diagnoses or other sensitive health information through website forms.",
            "Do not attempt to gain unauthorised access to any part of the site, including the administrative area.",
            "Do not interfere with the operation or security of the site.",
          ],
        },
      ],
    },
    {
      id: "ip",
      heading: "5. Intellectual property",
      blocks: [
        {
          p: "All content, branding and materials on this website are owned by or licensed to Swiss Behavioral Health and may not be reproduced without permission, except for personal, non-commercial reference.",
        },
      ],
    },
    {
      id: "accuracy",
      heading: "6. Accuracy of information",
      blocks: [
        {
          p: `We aim to keep information accurate and current, including licensing, insurance and program details. Information may change, and the most current details are always available by speaking with Admissions on ${site.phone.display}.`,
        },
      ],
    },
    {
      id: "third-party",
      heading: "7. Third-party links",
      blocks: [
        {
          p: "The site may link to third-party websites, such as map services. We are not responsible for the content or privacy practices of those sites.",
        },
      ],
    },
    {
      id: "liability",
      heading: "8. Limitation of liability",
      blocks: [
        {
          p: "To the fullest extent permitted by law, Swiss Behavioral Health is not liable for any indirect, incidental or consequential loss arising from your use of this website.",
        },
      ],
    },
    {
      id: "changes-terms",
      heading: "9. Changes",
      blocks: [
        {
          p: "We may revise these terms at any time. Continued use of the site after changes take effect constitutes acceptance of the revised terms.",
        },
      ],
    },
    {
      id: "contact-terms",
      heading: "10. Contact",
      blocks: [
        {
          p: `Questions about these terms may be directed to ${site.email.display}.`,
        },
      ],
    },
  ],
};