// Everything personal lives here. Swap the PLACEHOLDER values for your own
// name, logo, photos and video; the layout and motion read from this file.

export type Media = { url: string; alt: string; mimeType?: string };

export const site = {
  // PLACEHOLDER: the wordmark shown in the hero (the reference uses its owner's name).
  wordmark: "name.",

  // PLACEHOLDER: header + loader logo. Light theme uses `logo`, dark theme `logoDark`.
  logo: { url: "/placeholders/logo-primary.svg", alt: "Logo placeholder" },
  logoDark: { url: "/placeholders/logo-light.svg", alt: "Logo placeholder" },

  hero: {
    // PLACEHOLDER: big hero card. Set `video` to play a clip instead of the image.
    image: { url: "/placeholders/hero.webp", alt: "Hero media placeholder" } as Media | null,
    video: null as Media | null,
    videoPoster: null as Media | null,

    // PLACEHOLDER: the photo of you in the right-hand cell.
    portrait: { url: "/placeholders/portrait.webp", alt: "Portrait placeholder" } as Media | null,

    roles: ["Web Developer", "UX Designer", "Videographer"],

    // PLACEHOLDER: the line-drawn sketch in the bottom-right cell (one per theme).
    accentIcon: { url: "/placeholders/sketch-primary.svg", alt: "Sketch placeholder" } as Media | null,
    accentIconDark: { url: "/placeholders/sketch-light.svg", alt: "Sketch placeholder" } as Media | null,
  },

  menu: {
    // Shown on the left of the open menu while no item is hovered. Empty in the reference.
    media: null as Media | null,
    items: [
      { label: "about", url: "/about", media: { url: "/placeholders/menu.webp", alt: "Menu media placeholder" } },
      { label: "works", url: "/works", media: { url: "/placeholders/hero.webp", alt: "Menu media placeholder" } },
      { label: "contact", url: "/contact", media: { url: "/placeholders/portrait.webp", alt: "Menu media placeholder" } },
    ] as { label: string; url: string; media?: Media }[],
    // PLACEHOLDER: social links shown at the bottom of the menu panel.
    socials: [
      { label: "Instagram", url: "#" },
      { label: "YouTube", url: "#" },
      { label: "LinkedIn", url: "#" },
    ],
  },

  // Header world clocks. `home` gets the filled chip.
  clocks: [
    { label: "Brisbane", code: "AEST", tz: "Australia/Brisbane", locale: "en-AU", home: true },
    { label: "Sydney", code: "AEST", tz: "Australia/Sydney", locale: "en-AU" },
    { label: "Tokyo", code: "JST", tz: "Asia/Tokyo" },
    { label: "Berlin", code: "CET", tz: "Europe/Berlin", locale: "en-GB" },
    { label: "London", code: "GMT", tz: "Europe/London", locale: "en-GB" },
    { label: "New York", code: "EST", tz: "America/New_York", locale: "en-US" },
    { label: "Los Angeles", code: "PST", tz: "America/Los_Angeles", locale: "en-US" },
  ] as { label: string; code: string; tz: string; locale?: string; home?: boolean }[],
};
