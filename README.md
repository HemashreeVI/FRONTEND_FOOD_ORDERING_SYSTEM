<div align="center">

# 🍔 Tasty Bites

### A colorful, fully interactive food ordering website, built in a single HTML file.

Browse the menu, customize your dish, apply promo codes, check out, and watch your order move from kitchen to door.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![Dependencies](https://img.shields.io/badge/dependencies-none-12b886)
![Responsive](https://img.shields.io/badge/Responsive-yes-ff4d3d)
![License](https://img.shields.io/badge/License-MIT-green)

[Features](#-features) · [Getting started](#-getting-started) · [Promo codes](#-promo-codes) · [Customizing](#-customizing) · [Deploy](#-deploy-for-free) · [Roadmap](#-roadmap)

</div>

---

## ✨ Features

### Menu
- 🍽️ **16 dishes** across Pizza, Burgers, Asian, Mexican, Desserts and Drinks
- 🔍 **Live search** as you type
- 🏷️ **Category chips** plus a **❤️ Favorites** view
- 🌱 **Veg-only toggle** with veg / non-veg markers on every dish
- ↕️ **Sorting** by popularity, rating, or price (low to high, high to low)
- 🎲 **Surprise me** button that picks a random dish for you

### Ordering
- 🎛️ **Dish customizer** with size (Regular, Large, XL), extras, and quantity, with the price updating live
- 🛒 **Slide-out cart** with quantity controls and one-click remove
- 🛵 **Delivery or pickup** mode, which changes the delivery fee
- 🚚 **Free-delivery progress bar** that fills as you add items
- 💸 **Tip selector**, 8% tax, and a full price breakdown
- 🎟️ **Promo codes** validated on apply

### After checkout
- 📍 **Live order tracker** that steps through confirmed, cooking, on the way, and delivered
- 🎉 Confetti when the order arrives

### Quality of life
- 💾 **Cart and favorites persist** across page refreshes (via `localStorage`)
- 🌓 **Light and dark theme**, following your system setting with a manual toggle
- 📱 **Responsive** layout for phones, tablets and desktops
- ⌨️ **Keyboard friendly**: visible focus states, `Esc` closes any panel
- 🐢 Respects `prefers-reduced-motion`

---

## 🚀 Getting started

There is nothing to install and nothing to build.

```bash
git clone https://github.com/<your-username>/tasty-bites.git
cd tasty-bites
```

Then open **`tasty-bites.html`** in any modern browser (double-click it, or right-click → *Open with* → your browser).

> An internet connection is only needed to load the **Bricolage Grotesque** font from Google Fonts. Without it, the page falls back to the system font and still works.

---

## 🎟️ Promo codes

| Code | Effect |
|---|---|
| `TASTY10` | 10% off the subtotal |
| `YUM5` | $5 off orders of $20 or more |
| `FREESHIP` | Waives the delivery fee |

Delivery is also free automatically when the order is $30 or more (after discounts) or when you choose **Pickup**.

---

## 🧰 Tech stack

- **HTML5**, **CSS3** (custom properties, grid, flexbox, `color-mix`) and **vanilla JavaScript**
- No frameworks, no build step, no npm packages
- **Google Fonts** for typography (Bricolage Grotesque)
- Emoji as food imagery, so there are no image files to host

---

## 🗂️ Project structure

```
tasty-bites/
├── tasty-bites.html   # The entire app: markup, styles and logic
└── README.md
```

---

## 🛠️ Customizing

Everything lives in `tasty-bites.html`.

**Add or edit dishes.** Find the `M` array in the `<script>` and add an object:

```js
{ i: 17, n: 'Butter Chicken', e: '🍛', c: 'Asian', p: 12.49,
  d: 'Creamy tomato curry with soft naan',
  r: 4.8, t: 20, v: 0, s: 1, h: 1 }
```

| Key | Meaning |
|---|---|
| `i` | Unique id |
| `n` / `d` | Name / description |
| `e` | Emoji used as the picture |
| `c` | Category (must exist in the `G` color map) |
| `p` | Base price in dollars |
| `r` / `t` | Rating / prep time in minutes |
| `v` | `1` if vegetarian |
| `s` | Spice level, `0` to `3` |
| `h` | `1` to mark as Popular |

**Add a category.** Add it to the `cats` list inside `render()` and give it two gradient colors in the `G` object.

**Change sizes and extras.** Edit the `SZ` and `EX` arrays (name and price add-on).

**Add or change promo codes.** Update the `calc()` function for the discount logic and the code list inside the Apply button handler (`$('#pa').onclick`).

**Rebrand.** Change the color variables at the top of the `<style>` block (`--a`, `--b`, `--c`) and the logo text in the nav.

---

## 🌍 Deploy for free

**GitHub Pages**
1. Rename `tasty-bites.html` to `index.html` (so it loads at the root URL).
2. Push the repo to GitHub.
3. Go to **Settings → Pages**, set the source to your main branch, and save.
4. Your site will be live at `https://<your-username>.github.io/<repo-name>/` after a minute or two.

**Netlify / Vercel / Cloudflare Pages:** drag and drop the folder or connect the repo. No build command is needed.

---

## ⚠️ Limitations

This is a front-end demo, so a few things are simulated:

- **No real payments or accounts.** Checkout does not charge anything or send an order anywhere.
- **The order tracker is a simulation** on a timer, not connected to a kitchen or a rider.
- **Data stays in your browser.** Cart and favorites are saved with `localStorage`, so they are per-device and per-browser.

---

## 🗺️ Roadmap

- [ ] Real dish photos instead of emoji
- [ ] Order history page
- [ ] Backend and database for menu and orders (Node, Firebase or Supabase)
- [ ] Payment integration (Stripe or Razorpay)
- [ ] User accounts and saved addresses
- [ ] Map-based delivery tracking
- [ ] Dish ratings and reviews

---

## 🤝 Contributing

Ideas and pull requests are welcome. For bigger changes, please open an issue first so we can talk it through.

---

## 📜 License

Released under the [MIT License](LICENSE). Add a `LICENSE` file to your repository if you use this license.

---

<div align="center">

Made with 🍅 and a lot of cheese. If you like it, give the repo a ⭐

</div>
