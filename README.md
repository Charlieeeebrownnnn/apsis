# APSIS Fashion Site

APSIS is an experimental fashion and product showcase website built with Next.js.
The project focuses on cinematic storytelling, motion design, 3D interaction, and editorial-style visual presentation.

## Overview

This project explores how a fashion brand website can feel more like an interactive digital experience than a traditional e-commerce page.

The homepage combines:

* A cinematic hero video intro
* A loading and transition sequence
* A 3D orbital field built with React Three Fiber
* Interactive archive reveal behavior
* Scroll-based editorial image sections
* Motion-driven UI details for a premium brand feeling

## Tech Stack

* **Framework:** Next.js
* **Language:** TypeScript
* **UI:** React, Tailwind CSS
* **Animation:** Framer Motion, GSAP, ScrollTrigger
* **3D:** Three.js, React Three Fiber, Drei
* **CMS / Content:** Sanity client, next-sanity
* **Tooling:** ESLint

## Key Features

### Cinematic Hero Experience

The homepage starts with a full-screen video hero section.
After the intro completes, the hero transitions out with Framer Motion animation, including movement, blur, scale, border radius, and shadow effects.

### Interactive 3D Orbital Field

The editorial gallery uses React Three Fiber and Three.js to render a 3D orbital scene.
The visual concept presents fashion and motion through a space-inspired field with planets, rings, atmosphere, and interactive movement.

### Editorial Archive Interaction

After the orbital field is ready, users can trigger an archive reveal.
The archive section presents visual assets with editorial captions, image layouts, and scroll-based movement.

### Scroll-based Motion Design

GSAP and ScrollTrigger are used to create kinetic scrolling effects in the archive section, including moving lines, rails, arcs, and visual layers.

### Responsive Visual Layout

The interface uses Tailwind CSS utility classes to build responsive layouts, full-screen sections, editorial grids, and layered visual effects.

## Project Structure

```txt
app/
  page.tsx                     # Entry page
components/
  HomePageExperience.tsx        # Main homepage flow
  HeroSection.tsx               # Cinematic video hero
  LoadingIntro.tsx              # Loading transition
  EditorialGallery.tsx          # 3D orbital field and archive trigger
  LusionFieldScene.tsx          # Three.js / React Three Fiber scene
  EditorialArchiveSection.tsx   # Scroll-based editorial archive
  ManifestoSection.tsx          # Future content section
scripts/
  crop-clothes-detail.mjs
  import-chair-products.mjs
```

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Start the production server:

```bash
npm run start
```

## What I Practiced

Through this project, I practiced:

* Building a modern Next.js application with TypeScript
* Creating animation-rich UI with Framer Motion and GSAP
* Integrating Three.js scenes into React through React Three Fiber
* Structuring a visual-heavy homepage into reusable components
* Designing cinematic transitions and editorial-style interactions
* Managing user interaction states across loading, hero, gallery, and archive phases

## Future Improvements

* Add a complete product detail flow
* Connect more content from Sanity CMS
* Add screenshots and live demo link
* Improve accessibility for motion-heavy interactions
* Optimize large video and image assets for production performance

## Status

This is a portfolio project focused on front-end interaction design, visual storytelling, and modern web animation.
