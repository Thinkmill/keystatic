/**
 * Example: Keystatic config with GitHub Actions workflows
 *
 * Shows how to wire GitHub Actions workflows to Keystatic hooks and actions
 * using registerActions, registerHooks, useWorkflow, and awaitWorkflow.
 *
 * Prerequisites:
 *   1. Install: npm install @keystatic/core @keystatic/workflows
 *   2. Add workflow YAML files to .github/workflows/
 *   3. Create the API route at app/api/workflows/route.ts (see api-routes/workflows-route.ts)
 *   4. Set env vars: KEYSTATIC_GITHUB_OWNER, KEYSTATIC_GITHUB_REPO, GITHUB_TOKEN
 */

import {
  config,
  collection,
  fields,
  registerActions,
  registerHooks,
} from '@keystatic/core';
import { useWorkflow, awaitWorkflow } from '@keystatic/workflows';

export default config({
  storage: {
    kind: 'github',
    repo: { owner: 'your-org', name: 'your-repo' },
  },
  collections: {
    posts: collection({
      label: 'Posts',
      slugField: 'title',
      path: 'content/posts/*',
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        publishDate: fields.date({ label: 'Publish Date' }),
        content: fields.markdoc({ label: 'Content' }),
      },
    }),
  },
});

// ---------------------------------------------------------------------------
// Manual Actions — appear in the Actions (zap) dropdown on the editor toolbar
// ---------------------------------------------------------------------------

registerActions({ collection: 'posts' }, [
  // Translate the post to Spanish via GitHub Actions
  {
    label: 'Translate to Spanish',
    description: 'Duplicate and translate this post to Spanish',
    handler: useWorkflow('translate-post.yml', {
      input: ctx => ({
        slug: ctx.slug ?? '',
        title: (ctx.data.title as string) ?? '',
        language: 'es',
      }),
    }),
  },

  // Translate the post to French
  {
    label: 'Translate to French',
    description: 'Duplicate and translate this post to French',
    handler: useWorkflow('translate-post.yml', {
      input: ctx => ({
        slug: ctx.slug ?? '',
        title: (ctx.data.title as string) ?? '',
        language: 'fr',
      }),
    }),
  },

  // Run a content audit manually
  {
    label: 'Run Content Audit',
    description: 'Check SEO, quality, and publishing readiness',
    handler: useWorkflow('content-audit.yml', {
      input: ctx => ({
        slug: ctx.slug ?? '',
        title: (ctx.data.title as string) ?? '',
        has_content: ctx.data.content ? 'true' : 'false',
        publish_date: (ctx.data.publishDate as string) ?? '',
      }),
    }),
  },

  // Generate an OG image
  {
    label: 'Generate OG Image',
    description: 'Create a social media preview image',
    handler: useWorkflow('generate-og-image.yml', {
      input: ctx => ({
        slug: ctx.slug ?? '',
        title: (ctx.data.title as string) ?? '',
      }),
    }),
  },

  // AI: Generate summary
  {
    label: 'AI: Generate Summary',
    description: 'Create an AI-powered summary of this post',
    handler: useWorkflow('ai-content-assistant.yml', {
      input: ctx => ({
        slug: ctx.slug ?? '',
        title: (ctx.data.title as string) ?? '',
        task: 'summary',
      }),
    }),
  },

  // AI: Suggest SEO titles
  {
    label: 'AI: Suggest Titles',
    description: 'Get AI-optimized title suggestions',
    handler: useWorkflow('ai-content-assistant.yml', {
      input: ctx => ({
        slug: ctx.slug ?? '',
        title: (ctx.data.title as string) ?? '',
        task: 'suggest-titles',
      }),
    }),
  },
]);

// ---------------------------------------------------------------------------
// Automatic Hooks — fire on content lifecycle events
// ---------------------------------------------------------------------------

registerHooks({ collection: 'posts' }, {
  // Validate title before saving (runs client-side, no GitHub Actions needed)
  beforeSave: [
    async ctx => {
      const title = ctx.data.title as string | undefined;
      if (title && title.trim().length < 3) {
        return { cancel: true, reason: 'Title must be at least 3 characters' };
      }
    },
  ],

  // After save: auto-generate OG image via GitHub Actions (fire-and-forget)
  afterSave: [
    useWorkflow('generate-og-image.yml', {
      input: ctx => ({
        slug: ctx.slug ?? '',
        title: (ctx.data.title as string) ?? '',
      }),
    }),
  ],
});
