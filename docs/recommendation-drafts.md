# Recommendation drafts — send for approval, don't publish as-is

These are **suggested** recommendations for former leads to edit and approve.
Only add one to `data/recognition.json → testimonials` after that person has
said yes to the exact wording and to their name/title appearing on the site.

---

## Message to send

> Hi [Name],
>
> I'm putting together my portfolio site and would be grateful for a short
> recommendation (2–3 sentences) about our time working together at [Company].
>
> To save you time I've drafted something below based on what I worked on —
> please change anything you like, or write your own. I'll only publish it
> with your approval, along with your name and title.
>
> [paste draft]
>
> Thank you!
> Tahsin

---

## ScaleUp Ads Agency — for your manager / CEO

> "Tahsin joined us as a backend developer and quickly became someone the team
> relied on. He built secure, production-ready APIs for several client
> platforms — authentication, payments, real-time notifications — and his
> ownership and technical judgement are why we promoted him to lead our mobile
> app team. He communicates clearly with clients and mentors developers well."

## TS4U IT — for your team lead / supervisor

> "Tahsin led backend development for Orbit Task and took it to a successful
> beta launch. He also owned the entire backend for Vocalize Pro, including the
> OpenAI and social media integrations. He's dependable, picks up new
> technology fast, and delivers clean, well-structured work."

## GogoshopBD — for your supervisor

> "Tahsin worked across both the frontend and backend of our e-commerce
> platform. He shipped features reliably, improved our API performance through
> query optimization, and cared about giving customers a consistent
> experience. A hard-working developer and a great teammate."

## RP Shaha University — for Dr. Kingkar Prosad Ghosh (your reference)

> "Tahsin was a strong CSE student with a real passion for problem solving —
> he competed at the ICPC Asia Dhaka Regional 2021 and was runner-up in our
> university programming competition. His capstone project, a multi-vendor
> restaurant management system, showed solid full stack engineering skills."

---

## JSON format once approved

```json
"testimonials": [
  {
    "quote": "The approved text…",
    "name": "Full Name",
    "title": "CEO",
    "company": "ScaleUp Ads Agency"
  }
]
```

Approved testimonials show first, as star-rated cards, ahead of the highlights.
