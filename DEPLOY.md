# Cloudflare Pages

Use Bun 1.4.4 and install dependencies with `bun install --frozen-lockfile`.
Create a Cloudflare Pages project connected to this repository with:

- Build command: `bun run build`
- Build output directory: `dist`
- Root directory: repository root
- Node.js version: 20 or newer

Add `VITE_WEB3FORMS_ACCESS_KEY` as a Pages environment variable for both
Production and Preview deployments. Create the key in Web3Forms. This key is
used by the browser form and is not a server-side secret.

Set `VITE_ASSET_BASE_URL` to `https://r2.eastinflink.com` for both Production
and Preview to serve `/assets/*` from Cloudflare R2. Leave it unset locally to
use the checked-in `public/assets` files as a fallback. The R2 bucket must
allow public reads and return the correct image content types.

The site is a static Vite build. The build prerenders the Chinese homepage at
`/` and the English homepage at `/en/`; all other React Router pages remain
client-rendered and fall back to the `spa.txt` HTML shell on Cloudflare Pages.
English routes use the `/en/` prefix (for example, `/en/about`). The
`_redirects` and `_headers` files list the SPA routes explicitly so the
fallback does not intercept prerendered pages or JavaScript and CSS assets.

## Sanity EUDR verification records

Create a Sanity project and dataset, then set these variables for both
Production and Preview deployments before building:

- `VITE_SANITY_PROJECT_ID`: the Sanity project ID
- `VITE_SANITY_DATASET`: the dataset name (usually `production`)

The `/studio` route embeds Sanity Studio. Sign in with a Sanity account that has
edit access to the configured project to manage EUDR verification records.
Published records are searchable on `/verification`; drafts are not exposed.
The public site only uses Sanity's read-only public API and does not require an
API token. In the Sanity project settings, allow the deployed site's origin for
the dataset's CORS configuration, with credentials enabled for Studio sign-in.

### Public page copy

The Chinese and English homepage remain prerendered from the Vite build.
Published copy for About, Sustainability, Training, Verification, Partners, and
Contact is fetched from Sanity when a visitor opens or revisits those routes;
publishing these documents does not require a site rebuild. Deploy the site
once with the new Studio schema and runtime reader before using this workflow.
Existing image URLs and login, admin, and learner data remain outside this
content workflow.

After adding the new schema, seed each page's existing copy once from a local
environment that has a rotated, write-capable `SANITY_API_TOKEN` and the
Sanity project variables configured:

```powershell
bun run sanity:seed-public-copy --dry-run
bun run sanity:seed-public-copy
```

The seed command creates only missing page drafts and never overwrites an
existing draft or published document. Review and publish each page under
**内容管理 → 网站页面文案** in Studio. The browser reads published documents without a token, so the Sanity
dataset must permit public reads and the deployed origin must be allowed in
Sanity CORS settings. Do not expose `SANITY_API_TOKEN` through a `VITE_` variable.

Each record includes the DDS reference number, report holder/company, on-site
verification date, report validity end date, product type, the first four HS
Code digits, tree species, and conclusion. Visitors can search by company name
or DDS reference; when both are provided, a match on either field is returned.

## FSC CoC online course

### Supabase setup

Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` for both Cloudflare
Pages environments and locally in `.env.local`. Never put a Supabase service
role key in a `VITE_` variable or in the browser.

Apply the course schema from the repository root with the Supabase CLI:

```powershell
supabase db push
```

The migrations create the learner profile, private course progress, exam
attempts, and certificate records with row-level security enabled. Profiles are
created for both email and phone users; invited learners receive the `student` role.
The login page supports email/password and phone/OTP. The client keeps the auth
session in browser storage and refreshes it automatically; configure the
Supabase Auth maximum session duration to 30 days for the requested re-login
interval.

For an email admin test account, create a user in Supabase Dashboard under
**Authentication → Users → Add user**, set its email and password, and mark it
confirmed. Sign in at `/admin` with that email/password, then promote its
profile using the SQL below. This is a one-time bootstrap for the first
administrator; thereafter invite learners from **Admin → 学员管理**.

Disable public signup in **Authentication → Sign In / Providers → Email →
Allow new users to sign up**. Phone OTP requests also set
`shouldCreateUser: false`, so an unknown phone cannot create a learner. Admin
invitations use the Supabase Admin API and still require working Auth SMTP.
Configure SMTP and set the deployed site's `/login` URL under
**Authentication → URL Configuration → Redirect URLs** before sending invites.

Deploy the invite function and configure its server environment:

```powershell
bun x supabase@latest db push
bun x supabase@latest functions deploy invite-student
bun x supabase@latest functions deploy complete-student-invitation
bun x supabase@latest secrets set 'APP_SITE_URL=https://your-site-domain' 'APP_ALLOWED_ORIGINS=https://your-site-domain'
```

The function checks the caller's Supabase session and `profiles.role` before
using the server-only `SUPABASE_SERVICE_ROLE_KEY`. Email invitations are sent
through Supabase Auth SMTP. Phone invitations create an unconfirmed phone user;
the learner receives an SMS invitation link with their phone number prefilled,
then requests an OTP to sign in. The invitation SMS uses a separate approved
Aliyun template from the OTP SMS.
Set `APP_ALLOWED_ORIGINS` to a comma-separated list of exact site origins when
the app has more than one domain (for example production and preview URLs).
For local testing, include `http://localhost:5173` in that list.
Never expose the service role key to the browser. Invitees follow the Supabase
email link to `/login` and must set a password before accessing the course.
The `complete-student-invitation` function validates the invited learner's
session, sets the password with the service role, and only then clears the
database access gate. Phone learners continue to use SMS verification codes
without a password. Pending/activated status and email addresses are shown in
the admin learner list.

To enable learner profile editing and account deactivation, apply the
`20261022090000_student_account_management.sql` migration and deploy the
management function:

```powershell
bun x supabase@latest db push
bun x supabase@latest functions deploy manage-student
```

Admins can edit a learner's name and login email/phone, or deactivate and
restore the account. Contact changes require the learner to complete the
provider's verification flow. Deactivation blocks new Auth sessions and
revokes the learner's access to course data without deleting exam or
certificate records. The management function checks the caller's admin role
before using the server-only service role key.

Phone login uses a Supabase Send SMS Hook to deliver OTPs through Aliyun:

1. In the Aliyun SMS console, activate SMS, configure an approved SMS signature
   and two approved templates: an OTP template with the verification-code
   placeholder `${code}`, and an invitation template with a link placeholder
   `${link}`. Confirm Aliyun permits the invitation URL in the approved
   template, including the site's `/login?phone=...` query string.
   Create a RAM user/access key limited to the SMS send action. Keep its secret
   out of browser variables and source control.
2. Deploy the included Edge Function. From the repository root, set the
   function secrets in the Supabase Dashboard under **Edge Functions →
   Secrets**: `SEND_SMS_HOOK_SECRETS` (the hook signing secret),
   `ALIYUN_ACCESS_KEY_ID`, `ALIYUN_ACCESS_KEY_SECRET`,
   `ALIYUN_SMS_SIGN_NAME`, `ALIYUN_SMS_TEMPLATE_CODE` (OTP template),
   `ALIYUN_SMS_INVITE_TEMPLATE_CODE` (phone invitation template), and
   optionally `ALIYUN_SMS_ENDPOINT` (defaults to `dysmsapi.aliyuncs.com`; choose
   the endpoint documented for your Aliyun SMS product/region).
3. In **Authentication → Hooks**, add an HTTP **Send SMS** hook pointing to
   `https://<project-ref>.supabase.co/functions/v1/send-sms-hook`. Generate a
   webhook signing secret, save it as `SEND_SMS_HOOK_SECRETS` above, and enable
   the hook. The function verifies the Standard Webhooks signature before
   forwarding the one-time code.
4. Deploy the function without gateway JWT verification; it verifies the
   Supabase Auth Hook signature itself:

   ```powershell
   bun x supabase@latest functions deploy send-sms-hook --no-verify-jwt
   ```

5. In **Authentication → Hooks → Send SMS**, choose the deployed HTTP function,
   paste its URL, and save the same webhook secret in the hook configuration and
   `SEND_SMS_HOOK_SECRETS`. Enable the hook before testing.
6. Enable Phone sign-in in **Authentication → Providers → Phone**. If the
   Dashboard still insists on a built-in provider key, do not enter an Aliyun
   key into that unrelated field: first save the Send SMS Hook, then reload the
   provider page and check the current Supabase project/plan UI. A hook overrides
   SMS delivery, but a Dashboard flow that requires a built-in provider may
   still require one of Supabase's supported provider configurations. Check the
   Supabase Auth logs for the exact configuration error. Test with an E.164
   phone number and check both Edge Function logs and Aliyun SMS delivery
   records if a message fails.

The HTTP function is at `supabase/functions/send-sms-hook/index.ts`. It sends
the OTP as the Aliyun template parameter `{ "code": "<OTP>" }`. The
`invite-student` function sends phone invitations using the separate template
parameter `{ "link": "<site URL with phone prefilled>" }`; if Aliyun rejects
the send, it removes the newly created phone account so the administrator can
correct the configuration and retry. Mainland China and international
destinations may require different Aliyun SMS products, endpoints, signatures,
templates, and destination allowlists. Confirm the account's permitted
region/product in Aliyun before production use.

To create the requested phone-based accounts after the Aliyun SMS hook is
configured, the first administrator account must be bootstrapped by a project
administrator in Supabase Auth, then promoted in SQL. Thereafter add learners
from the admin dashboard; do not create public sign-up paths. Promote only the
intended administrator from the Supabase SQL Editor:

```sql
update public.profiles
set role = 'admin'
where phone = '<ADMIN_PHONE_IN_E164_FORMAT>';
```

For an email-based administrator, use `where email = '<ADMIN_EMAIL>';` instead.
Set the role only in the SQL Editor; the second account remains a normal
learner. Do not assign roles through the public client. `/admin` provides the
administrator dashboard with learner listing, manual exam grading, course
analytics, and certificate registration; `/courses` is the authenticated
learner portal.

### Sanity course content and video playback

In `/studio`, open **课程 → FSC CoC → 课程内容** to edit the single FSC CoC
course document. The editor is pinned to document ID `fsc-coc-course`; do not
create a second course document. A first-time setup opens this fixed document
with the FSC CoC title, fixed `fsc-coc` slug, six lesson titles, course
outlines, and the matching video IDs and durations from `Video_List.csv`.
Publish the document after reviewing the lesson order. Playback URLs are kept
in the frontend's course video configuration and are not stored in Sanity.

For local development only, each lesson also has an optional **开发测试 MP4**
file field. Upload a small `video/mp4` file there, publish the course, then use
the lesson's **测试 MP4** button on a local `bun run dev` page to play it. That
button and source selector are compiled out of production builds; production
learners continue to use Aliyun HLS only. Sanity Dataset assets are public to
anyone with the asset URL, so do not upload confidential videos or treat this
field as protected backup storage. To use Studio locally, add the exact local
origin (for example `http://127.0.0.1:5173`) to the Sanity project's CORS origins
and sign into Studio with an account permitted to edit the dataset.

After a learner signs in, the course page supplies the matching M3U8 address
directly to the player. There is no playback Cloudflare Function; playlists
and video segments are requested directly from the video host. The video URL
is visible in browser developer tools and can be copied, and login gating on
the course page does not restrict direct access to a publicly reachable video
URL. Configure the video host's referer allowlist to permit
`www.eastinflink.com` if referer protection is enabled.

The learner page dynamically loads the official
[AliyunPlayer_Web SDK](https://github.com/aliyunvideo/AliyunPlayer_Web) from
Alibaba Cloud's CDN to play the HLS source. On entering the learner course
page, the SDK and stylesheet are preloaded and the player/video CDN connections
are preconnected, so the first click does not need to wait for SDK download.
A moving on-video watermark
shows the signed-in learner's user ID as a deterrent to screen recording; it
cannot prevent screenshots or external recording.

The course is configured to use HTTPS URLs for all HLS videos. The video host
must have a valid HTTPS certificate and browser-accessible CORS headers for
HLS playlists and media segments; playback will fail until those are in place.
Plain `bun run dev` can test the player after the video host's HTTPS and CORS
configuration is available.
The examination contains seven subjective questions from
`FSC产销监管链考试.docx`; students see only their own submissions/results, while
administrators award up to 14 points manually. A score of 10 or higher enables
the administrator's certificate registration action.