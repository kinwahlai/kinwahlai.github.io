# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bundle install          # Install Ruby gems (first time / after Gemfile changes)
./serve.sh              # Clean cache + start dev server at localhost:4000
./new-post.sh "Title"   # Scaffold a new blog post with front matter and image dir
bundle exec jekyll build  # Production build to _site/
```

There is no test suite or linter configured. Build validation happens automatically via GitHub Actions on push to the `website` branch.

## Architecture

**Jekyll static site** using the [jekyll-theme-prologue](https://github.com/chrisbobbe/jekyll-theme-prologue) theme. Deployed to GitHub Pages automatically via `.github/workflows/jekyll.yml` on push to `website` branch.

### Key Directories

- `_posts/` — Blog posts in `YYYY-MM-DD-slug.md` format. Front matter requires: `layout: post`, `title`, `date`, `categories`, `cover-photo`, `excerpt`.
- `_sections/` — Homepage sections rendered in order by the `order` field. Add/edit homepage content here (intro, services, testimonials, about-me, contact).
- `_data/menus.yml` — Navigation menu items with `weight` for ordering.
- `_data/testimonials.yml` — Testimonial entries rendered in the testimonials section.
- `_layouts/` — Page templates. `home.html` renders sections; `post.html` is for blog posts.
- `_includes/` — Reusable partials. `section.html` is the section renderer used by `home.html`.
- `_sass/` — SCSS. Main file: `_sass/jekyll-theme-prologue.scss`.
- `assets/images/blog-posts/{YYYY-MM-DD}/` — Convention for blog post images, matching the post date.

### Content Model

The homepage is section-based (not a traditional page). Each `_sections/*.html` file has YAML front matter (`title`, `subtitle`, `cover-photo`, `order`) and HTML/Liquid body content.

Blog posts use `categories: Satir` (Virginia Satir coaching model) as the primary category.
