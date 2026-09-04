import type { GalleryEntry } from '../types'

export const galleryRegistry: GalleryEntry[] = [
  {
    "id": "complete-task-page",
    "name": "Complete Task Page (Sprint Board & Kanban)",
    "category": "Task",
    "badge": "Task Page",
    "description": "Exact full-view dual pane layout matching the Task section: Left sidebar with active Task card + Right main Sprint Board with draggable Kanban columns (To Do, In Progress, Under Review, Completed), priority badges, avatars, and task actions.",
    "filePath": "src/features/kanbantemplate/index.tsx"
  },
  {
    "id": "task-card-item",
    "name": "Task Card Item",
    "category": "Task",
    "badge": "Task Card",
    "description": "Sidebar card representing the Tasks / Kanban Board section. Shows project title, date range badge, and Kanban label.",
    "filePath": "src/features/Message/components/sidebar/task-card-item.tsx"
  },
  {
    "id": "complete-notification-page",
    "name": "Complete Notifications Page (Layout)",
    "category": "Notifications",
    "badge": "Notifications",
    "description": "Full-view layout for Notifications: Left sidebar showing notification cards with unread badges + Right panel displaying detailed notification context, sender info, action triggers, and quick response options.",
    "filePath": "src/features/Message/components/panels/notification-detail-panel.tsx"
  },
  {
    "id": "notification-card-item",
    "name": "Notification Card Item",
    "category": "Notifications",
    "badge": "Notice Card",
    "description": "Sidebar notification item card. Shows sender name, message text, unread dot, timestamp, and Notification badge.",
    "filePath": "src/features/Message/components/sidebar/notification-card-item.tsx"
  },
  {
    "id": "file-manager-view",
    "name": "File Manager View",
    "category": "Files",
    "badge": "File Explorer",
    "description": "Complete cloud storage explorer and file manager featuring folder headers, stats badges, search filtering, category pills (All, PDFs, Docs, Spreadsheets, Images, Videos, Archives), sorting, Grid/Table view switch, multi-select bulk actions, and pagination.",
    "filePath": "src/design-system/components/files/user-file-cards-view.tsx"
  },
  {
    "id": "file-card-item",
    "name": "File Card Item",
    "category": "Files",
    "badge": "File Card",
    "description": "Individual file card component with category-tailored themes (PDF red, Doc blue, XLS emerald, Image amber, Video purple, Zip orange), rich media/icon preview, size & date meta, quick preview/download, and 3-dot dropdown actions.",
    "filePath": "src/design-system/components/files/file-card-item.tsx"
  },
  {
    "id": "file-upload-form",
    "name": "File Upload & Document Composer",
    "category": "Files",
    "badge": "Upload Composer",
    "description": "Document composer and uploader with template selector, subject/title input, destination space dropdowns, rich text formatting toolbar, multi-file dropzone, live upload progress bars, and remarks.",
    "filePath": "src/features/Message/components/files/file-upload-form.tsx"
  },
  {
    "id": "file-uploader-viewer",
    "name": "File Attachment & Document Viewer",
    "category": "Files",
    "badge": "Doc Viewer",
    "description": "Full-featured drag & drop document attachment uploader and inline document reader supporting CSV, DOCX, XLSX, PDF, PNG, and ZIP with download and JSON export.",
    "filePath": "src/features/MessageComponentGallery/previews/FileUploaderAndViewerPreview.tsx"
  },
  {
    "id": "folder-tree-item",
    "name": "Folder Tree Navigation",
    "category": "Files",
    "badge": "Folder Tree",
    "description": "Hierarchical collapsible folder tree node for file navigation sidebar with 3-level nesting (root, user workspace, category subfolder), file count badge, and active selection indicator.",
    "filePath": "src/design-system/components/files/folder-tree-item.tsx"
  },
  {
    "id": "complete-kanban-board",
    "name": "Complete Kanban Board Template",
    "category": "Kanban Board",
    "badge": "Kanban Board",
    "description": "Full interactive Kanban Board template featuring draggable task columns (To Do, In Progress, Under Review, Completed), priority badges, assignee avatars, progress tracking, column actions, and task modals.",
    "filePath": "src/features/kanbantemplate/index.tsx"
  },
  {
    "id": "complete-vouchers-page",
    "name": "Voucher Form (AI OCR & Print)",
    "category": "Vouchers",
    "badge": "Voucher Form",
    "description": "Complete interactive 3-step Voucher creation form (Upload Document, Edit Fields, Voucher Preview) featuring OCR document parser (PDF, PNG, JPG, DOCX), structured field editor (ReviewPanel), and document print preview.",
    "filePath": "src/features/vouchers/components/invoice-maker.tsx"
  },
  {
    "id": "new-voucher-scan",
    "name": "New Voucher Scan",
    "category": "Vouchers",
    "badge": "Voucher Scan",
    "description": "Voucher document processing workflow featuring the file metadata upload form on Step 1 with auto OCR extraction.",
    "filePath": "src/features/MessageComponentGallery/previews/NewVouncherScan.tsx"
  },
  {
    "id": "new-vouncher",
    "name": "New Voucher ",
    "category": "Vouchers",
    "badge": "New Voucher",
    "description": "Voucher document processing workflow featuring the file metadata upload form on Step 1 with auto OCR extraction.",
    "filePath": "src/features/MessageComponentGallery/previews/NewVouncher.tsx"
  },
  {
    "id": "complete-analytics-dashboard",
    "name": "Analytics Dashboard",
    "category": "Analytics",
    "badge": "Analytics",
    "description": "Complete analytics dashboard component featuring weekly traffic overview line chart, click metric cards (+12.4%), unique visitors, bounce rate, average session duration, top referrers, and device distribution lists.",
    "filePath": "src/features/dashboard/components/analytics.tsx"
  },
  {
    "id": "complete-stats-blocks",
    "name": "Stats Blocks Collection",
    "category": "Stats",
    "badge": "Stats Blocks",
    "description": "Complete collection of 15 beautifully styled metric & stats blocks: Trending indicators, border cards, badges, status indicators, circular progress rings, area sparklines, and usage breakdown bars.",
    "filePath": "src/features/dashboard/components/stats.tsx"
  },
  {
    "id": "card-19-integration",
    "name": "Card 19 - Integration Card",
    "category": "Data Cards",
    "badge": "Integration",
    "description": "App integration card featuring Slack integration status, toggle switch, connection badge, description, and settings link.",
    "filePath": "src/features/MessageComponentGallery/previews/DataCardsPreview.tsx"
  },
  {
    "id": "card-18-credit-card",
    "name": "Card 18 - Credit Card",
    "category": "Data Cards",
    "badge": "Credit Card",
    "description": "Sleek credit card component featuring EMV chip, contactless wave icon, card number, cardholder name, expiration date, and Visa logo.",
    "filePath": "src/features/MessageComponentGallery/previews/DataCardsPreview.tsx"
  },
  {
    "id": "card-17-ecommerce-variant",
    "name": "Card 17 - Ecommerce Product Variant Card",
    "category": "Data Cards",
    "badge": "Ecommerce",
    "description": "Product card featuring product image, rating stars, price discount tag, interactive color swatches, size selector buttons, and Add to Cart button.",
    "filePath": "src/features/MessageComponentGallery/previews/DataCardsPreview.tsx"
  },
  {
    "id": "card-11-assign-task",
    "name": "Card 11 - Assign Task Card",
    "category": "Data Cards",
    "badge": "Assign Task",
    "description": "Task assignment card featuring priority badge, task description, assignee selector avatar, due date indicator, and Assign Task confirm button.",
    "filePath": "src/features/MessageComponentGallery/previews/DataCardsPreview.tsx"
  },
  {
    "id": "card-10-appointment",
    "name": "Card 10 - Appointment Card",
    "category": "Data Cards",
    "badge": "Appointment",
    "description": "Medical & Meeting appointment card featuring practitioner avatar, confirmation status badge, scheduled date & time, location room, and reschedule/join actions.",
    "filePath": "src/features/MessageComponentGallery/previews/DataCardsPreview.tsx"
  },
  {
    "id": "card-06-statistics",
    "name": "Card 06 - Statistics Card",
    "category": "Data Cards",
    "badge": "Statistics",
    "description": "Revenue & Metric statistics card featuring primary metric value ($128,450.00), growth percentage badge (+18.4%), mini sparkline visualization, and target achievement ratio.",
    "filePath": "src/features/MessageComponentGallery/previews/DataCardsPreview.tsx"
  },
  {
    "id": "data-cards-overview",
    "name": "Data Cards Suite (Overview)",
    "category": "Data Cards",
    "badge": "Full Suite",
    "description": "Complete collection of application data cards: Integration status, Credit Card, Ecommerce Product Variants, Task Assignment, Medical Appointment, and Revenue Statistics.",
    "filePath": "src/features/MessageComponentGallery/previews/DataCardsPreview.tsx"
  },
  {
    "id": "area-chart-card",
    "name": "Area Chart Card",
    "category": "Charts",
    "badge": "Area Chart",
    "description": "Responsive Area Chart component featuring dual gradient filled paths, time range selectors (30d / 7d), interactive tooltip tooltips, and total desktop/mobile visitor metrics.",
    "filePath": "src/features/charttemplate/components/AreaChartCard.tsx"
  },
  {
    "id": "bar-chart-card",
    "name": "Bar Chart Card",
    "category": "Charts",
    "badge": "Bar Chart",
    "description": "Stacked Bar Chart component displaying multi-series data bars (Desktop vs Mobile) with date axis formatting, legend indicators, and responsive card wrapper.",
    "filePath": "src/features/charttemplate/components/BarChartCard.tsx"
  },
  {
    "id": "line-chart-card",
    "name": "Line Chart Card",
    "category": "Charts",
    "badge": "Line Chart",
    "description": "Smooth curved Line Chart component featuring multi-line metrics, active dot highlights, custom tooltip content, and responsive container scaling.",
    "filePath": "src/features/charttemplate/components/LineChartCard.tsx"
  },
  {
    "id": "pie-chart-card",
    "name": "Pie & Donut Chart Card",
    "category": "Charts",
    "badge": "Pie Chart",
    "description": "Donut Pie Chart component displaying category distributions, central summary label, colored segment keys, and total percentage breakdown.",
    "filePath": "src/features/charttemplate/components/PieChartCard.tsx"
  },
  {
    "id": "radar-chart-card",
    "name": "Radar Chart Card",
    "category": "Charts",
    "badge": "Radar Chart",
    "description": "Polygonal Radar Chart component comparing multi-axis performance metrics across desktop and mobile platforms with custom grid colors.",
    "filePath": "src/features/charttemplate/components/RadarChartCard.tsx"
  },
  {
    "id": "radial-chart-card",
    "name": "Radial Bar Chart Card",
    "category": "Charts",
    "badge": "Radial Chart",
    "description": "Concentric Radial Bar Chart displaying percentage completion rings with central metric text and subtle background tracks.",
    "filePath": "src/features/charttemplate/components/RadialChartCard.tsx"
  },
  {
    "id": "tooltip-chart-card",
    "name": "Tooltip & Formatted Chart Card",
    "category": "Charts",
    "badge": "Tooltip Chart",
    "description": "Advanced Interactive Chart featuring custom popover tooltips, currency formatters, date range toggles, and detail data inspection.",
    "filePath": "src/features/charttemplate/components/TooltipChartCard.tsx"
  },
  {
    "id": "complete-map-template",
    "name": "Interactive Map Template",
    "category": "Maps",
    "badge": "Map View",
    "description": "Full interactive Leaflet/MapLibre map component with location search bar (`MapSearchBar`), custom pin markers, popup detail cards (`MapPopup`), explore location panels, and zoom controls.",
    "filePath": "src/features/map/index.tsx"
  },
  {
    "id": "complete-mail-page",
    "name": "Complete Mail Page (Layout)",
    "category": "Mail",
    "badge": "Mail Page",
    "description": "Full split-screen Mail Page layout showing the interactive left sidebar (Inbox/Sent tabs, search bar, email cards, pagination) combined with the active email reader and composer.",
    "filePath": "src/features/Message/index.tsx"
  },
  {
    "id": "email-view",
    "name": "Email View (Full Reader)",
    "category": "Mail",
    "badge": "Email Reader",
    "description": "Complete email viewing screen with sender information, recipient badges, CC/BCC display, sanitized HTML body, download buttons, attachments grid, and reply composer.",
    "filePath": "src/features/Message/components/emails/email-view.tsx"
  },
  {
    "id": "new-email",
    "name": "New Email (Composer Modal)",
    "category": "Mail",
    "badge": "New Email",
    "description": "Full-featured email composer with To/CC/BCC recipient fields, Subject input, Template dropdown, Priority flags, Attachment picker with upload progress, and Rich text editor.",
    "filePath": "src/features/Message/components/emails/new-email.tsx"
  },
  {
    "id": "email-editor",
    "name": "Email Editor (Inline Reply)",
    "category": "Mail",
    "badge": "Inline Reply",
    "description": "Inline quick reply editor with rich text toolbar (Bold, Italic, Strikethrough, Code, H1-H6 headings, Lists, Links, Undo/Redo), Cmd+J AI autocomplete tip, and send button.",
    "filePath": "src/features/Message/components/emails/email-editor.tsx"
  },
  {
    "id": "email-detail",
    "name": "Email Detail View",
    "category": "Mail",
    "badge": "Email Detail",
    "description": "Structured email reader displaying sender avatar, timestamp, sanitized HTML email body or newsletter deal mockup, action icons, and reply composer.",
    "filePath": "src/features/Message/components/emails/email-detail.tsx"
  },
  {
    "id": "email-card-item",
    "name": "Email Card Item",
    "category": "Mail",
    "badge": "Email Card",
    "description": "Email list item card. Shows sender avatar, name, subject, preview snippet, labels, unread dot, timestamp, and 10-action dropdown menu.",
    "filePath": "src/features/Message/components/sidebar/email-card-item.tsx"
  },
  {
    "id": "email-list-skeleton",
    "name": "Email List Skeleton",
    "category": "Mail",
    "badge": "Skeleton",
    "description": "Animated loading skeleton displayed in the sidebar while emails are being fetched.",
    "filePath": "src/features/Message/components/sidebar/email-list-skeleton.tsx"
  },
  {
    "id": "chat-sidebar",
    "name": "Chat Sidebar",
    "category": "Chat",
    "badge": "Chat Sidebar",
    "description": "Master sidebar container with subtabs (Chats, Contact, Groups, Folder), search bar, category divider line with count, and a scrollable conversation list.",
    "filePath": "src/design-system/components/chat/chat-sidebar.tsx"
  },
  {
    "id": "chat-card-item",
    "name": "Chat Card Item",
    "category": "Chat",
    "badge": "Chat Card",
    "description": "Conversation preview card for sidebar list. Displays contact name, pill badge (💬 Chat), timestamp, member & online counter, and last message snippet with active left accent stripe.",
    "filePath": "src/design-system/components/chat/chat-card-item.tsx"
  },
  {
    "id": "chat-input",
    "name": "Chat Input (Composer)",
    "category": "Chat",
    "badge": "Chat Input",
    "description": "Modern messaging pill input container with emoji picker, attachment clip, camera trigger, and circular emerald green microphone/send button.",
    "filePath": "src/design-system/components/chat/chat-input.tsx"
  },
  {
    "id": "chat-header",
    "name": "Chat Header",
    "category": "Chat",
    "badge": "Chat Header",
    "description": "Conversation header bar with user avatar, status/presence, and exact HeaderActions (Act on this bell, Quick Flag, and 3-dot dropdown menu).",
    "filePath": "src/design-system/components/chat/chat-header.tsx"
  },
  {
    "id": "chat-message-list",
    "name": "Chat Message List",
    "category": "Chat",
    "badge": "Message List",
    "description": "Scrollable message viewport container with automatic auto-scroll to bottom, infinite scroll top loader for history, and rich bubble rendering for text, live location cards, and media attachments.",
    "filePath": "src/design-system/components/chat/chat-message-list.tsx"
  },
  {
    "id": "message-bubble",
    "name": "Message Bubble",
    "category": "Chat",
    "badge": "Chat Bubble",
    "description": "Pure, customizable message bubble. Supports text, file/PDF attachments, location cards, status delivery receipts (sent, delivered, read), and interactive reactions.",
    "filePath": "src/design-system/components/chat/chat-bubble.tsx"
  },
  {
    "id": "typing-indicator",
    "name": "Typing Indicator",
    "category": "Chat",
    "badge": "Typing",
    "description": "Smooth 3-dot pulse animation indicating live incoming message activity.",
    "filePath": "src/design-system/components/chat/typing-indicator.tsx"
  },
  {
    "id": "chat-empty-state",
    "name": "Chat Empty State",
    "category": "Chat",
    "badge": "Empty State",
    "description": "Clean placeholder screen displayed when no conversation is selected or a message thread is empty.",
    "filePath": "src/design-system/components/chat/chat-empty-state.tsx"
  },
  {
    "id": "contact-manager",
    "name": "Contact Manager",
    "category": "Chat",
    "badge": "Contacts",
    "description": "Standalone contact management interface. Displays saved contacts with avatar initials, email, status toggle switch, and direct actions for Chat, Edit, and Delete.",
    "filePath": "src/design-system/components/chat/contact-manager.tsx"
  },
  {
    "id": "group-manager",
    "name": "Groups Manager",
    "category": "Chat",
    "badge": "Groups",
    "description": "Group channel manager for creating, searching, and managing team chat groups with member counts and instant chat triggers.",
    "filePath": "src/design-system/components/chat/group-manager.tsx"
  },
  {
    "id": "ai-chat-input",
    "name": "AI Chat Input (Composer)",
    "category": "AI",
    "badge": "AI Input",
    "description": "Pill-shaped multi-model AI chat input. Features prompt textarea, voice microphone trigger, circular send button, and bottom toolbar with AI Model & Tool dropdown selectors.",
    "filePath": "src/design-system/components/ai-chat/ai-chat-input.tsx"
  },
  {
    "id": "ai-message-list",
    "name": "AI Message List",
    "category": "AI",
    "badge": "Message List",
    "description": "Conversation stream for AI chat with auto-scroll and initial prompt suggestion cards fallback.",
    "filePath": "src/design-system/components/ai-chat/ai-message-list.tsx"
  },
  {
    "id": "ai-message-bubble",
    "name": "AI Message Bubble",
    "category": "AI",
    "badge": "AI Bubble",
    "description": "Clean message bubble for AI interactions. Renders user prompts with dark circle avatar, and assistant answers with markdown formatting, syntax highlighting, and citations.",
    "filePath": "src/design-system/components/ai-chat/ai-message-bubble.tsx"
  },
  {
    "id": "ai-model-selector",
    "name": "AI Model Selector",
    "category": "AI",
    "badge": "Model Picker",
    "description": "Standalone model picker dropdown button supporting Gemini 2.5, GPT-4o, Claude 3.5, DeepSeek, and Llama 3.3.",
    "filePath": "src/design-system/components/ai-chat/ai-model-selector.tsx"
  },
  {
    "id": "ai-tool-selector",
    "name": "AI Tool Selector",
    "category": "AI",
    "badge": "Tool Picker",
    "description": "Standalone tool switcher dropdown button for switching between AI Chat, Web Search, and UI Render.",
    "filePath": "src/design-system/components/ai-chat/ai-tool-selector.tsx"
  },
  {
    "id": "ai-prompt-suggestions",
    "name": "AI Prompt Suggestions",
    "category": "AI",
    "badge": "Suggestions",
    "description": "Interactive prompt recommendation cards for zero-state onboarding.",
    "filePath": "src/design-system/components/ai-chat/ai-prompt-suggestions.tsx"
  },
  {
    "id": "ai-chat-header",
    "name": "AI Chat Header",
    "category": "AI",
    "badge": "AI Header",
    "description": "Top header bar for AI Assistant conversations with title, sparkle icon, powered by AI subtitle, and exact HeaderActions (Bell, Flag, and 3-dot dropdown menu).",
    "filePath": "src/design-system/components/ai-chat/ai-chat-header.tsx"
  },
  {
    "id": "sidebar-header",
    "name": "Sidebar Header",
    "category": "Shared",
    "badge": "Sidebar Header",
    "description": "Desktop-only sidebar top bar with \"Messages\" title, email settings icon, and notification bell with unread badge.",
    "filePath": "src/features/Message/components/sidebar/sidebar-header.tsx"
  },
  {
    "id": "category-toolbar",
    "name": "Category Toolbar",
    "category": "Shared",
    "badge": "Toolbar",
    "description": "Horizontal icon toolbar with 6 category buttons: Tasks, Mail, Chat, AI Chat, AI Assistant, Files/Vouchers.",
    "filePath": "src/features/Message/components/sidebar/category-toolbar.tsx"
  },
  {
    "id": "sub-tabs-bar",
    "name": "Sub Tabs Bar",
    "category": "Shared",
    "badge": "Subtabs",
    "description": "Dynamic tab bar below the category toolbar. Shows context-specific tabs: Inbox/Sent/Folder for mail, Chats/Contact/Groups for chat, etc.",
    "filePath": "src/features/Message/components/sidebar/sub-tabs-bar.tsx"
  },
  {
    "id": "sidebar-search-bar",
    "name": "Sidebar Search Bar",
    "category": "Shared",
    "badge": "Search Bar",
    "description": "Search input with clear button. Shows a \"New Email\" compose button for mail mode or \"Upload\" button for file mode.",
    "filePath": "src/features/Message/components/sidebar/sidebar-search-bar.tsx"
  },
  {
    "id": "sidebar-pagination",
    "name": "Sidebar Pagination",
    "category": "Shared",
    "badge": "Pagination",
    "description": "Compact pagination controls showing \"1–20 of 48\" with prev/next buttons. Used in the mail sidebar.",
    "filePath": "src/features/Message/components/sidebar/sidebar-pagination.tsx"
  },
  {
    "id": "header-actions",
    "name": "Header Actions Dropdown",
    "category": "Shared",
    "badge": "Header Menu",
    "description": "Header action button group featuring \"Act on this\" button (Bell icon left of Flag), Quick Flag button, and a 3-dot \"More\" dropdown menu with exact items: Reply, Forward, Pin Message, Star, Favorite, Flag, Archive, Action This >, and Delete >.",
    "filePath": "src/features/Message/components/chat/header-actions.tsx"
  },
  {
    "id": "email-header",
    "name": "Email View Header",
    "category": "Shared",
    "badge": "Email Header",
    "description": "Complete top bar for the Email View component. Displays sender avatar, \"From: Name\", email address, HeaderActions (with exact 9 dropdown options: Reply, Forward, Pin Message, Star, Favorite, Flag, Archive, Action This >, Delete >), and close button without the Back button.",
    "filePath": "src/features/Message/components/emails/email-view.tsx"
  },
  {
    "id": "chat-icon-bar",
    "name": "Chat Icon Bar",
    "category": "Shared",
    "badge": "Icon Bar",
    "description": "Floating action toolbar pill for chat & AI responses. Displays Audio icon (Volume2 on the left), ThumbsUp, ThumbsDown, Copy, Share, and 3-Dot More menu trigger.",
    "filePath": "src/features/Message/components/chat/chat-icon-bar.tsx"
  },
  {
    "id": "three-dot-menu",
    "name": "3-Dot Menu",
    "category": "Shared",
    "badge": "3-Dot Menu",
    "description": "Standalone 3-Dot More options dropdown menu component. Displays ONLY the 3-Dot button trigger which opens the full 9 action options: Reply, Forward, Pin Message, Star, Favorite, Flag, Archive, Action This >, and Delete >.",
    "filePath": "src/features/Message/components/chat/three-dot-menu.tsx"
  },
  {
    "id": "side-list-card",
    "name": "Side List Card",
    "category": "Shared",
    "badge": "Side Card",
    "description": "Purple/indigo tinted item card with left accent bar, clean top timestamp (\"18 aug 26 14.41 / about 2 hours ago\"), demo sender name (\"Jordan Lee\"), and on hover or tap displays the Chat Icon Bar at the bottom with 3-dot menu.",
    "filePath": "src/features/Message/components/sidebar/side-list-card.tsx"
  },
  {
    "id": "attachment-card-uploader",
    "name": "Attachment Card & Uploader",
    "category": "Shared",
    "badge": "Attachment",
    "description": "File attachment card displaying title (\"Attachments (1)\"), file item with badge, name (\"Q3-Update.pdf\"), size (\"2.4 MB\"), download & view buttons, and an interactive \"Attach Files\" trigger with live upload progress bar animation.",
    "filePath": "src/features/Message/components/shared/attachment-card-uploader.tsx"
  },
  {
    "id": "progress-linear",
    "name": "Progress - Linear Bar & Status Colors",
    "category": "Shared",
    "badge": "Progress Bar",
    "description": "Animated linear progress bar with value display, status color variants (success emerald, processing indigo, warning amber), and interactive controls.",
    "filePath": "src/components/ui/progress.tsx"
  },
  {
    "id": "progress-step-indicator",
    "name": "Progress - Segmented Step Indicator",
    "category": "Shared",
    "badge": "Step Indicator",
    "description": "Multi-stage step progress tracker showing active, completed, and pending workflow steps with connecting line indicator.",
    "filePath": "src/features/MessageComponentGallery/previews/ProgressPreviews.tsx"
  },
  {
    "id": "progress-circular",
    "name": "Progress - Circular Radial Ring",
    "category": "Shared",
    "badge": "Radial Ring",
    "description": "Radial circular progress ring with center percentage readout and sync status message.",
    "filePath": "src/features/MessageComponentGallery/previews/ProgressPreviews.tsx"
  },
  {
    "id": "questionnaire-wizard",
    "name": "Questionnaire & Onboarding Wizard",
    "category": "Wizards",
    "badge": "Wizard Flow",
    "description": "Multi-step questionnaire flow matching shadcn Questionnaire specs. Features personal details, calendar session date & time picker, feature choices, progress bar, and summary view.",
    "filePath": "src/features/MessageComponentGallery/previews/QuestionnaireAndWizardPreviews.tsx"
  },
  {
    "id": "date-picker-graphical",
    "name": "Date Picker - Graphical & SwiftUI Style",
    "category": "Date Picker",
    "badge": "SwiftUI Style",
    "description": "Interactive graphical inline calendar date picker matching Expo SwiftUI DatePicker specifications with highlighted selection ring, month navigation, and quick today trigger.",
    "filePath": "src/components/ui/date-picker.tsx"
  },
  {
    "id": "date-picker-wheel",
    "name": "Date Picker - Wheel & Time Style",
    "category": "Date Picker",
    "badge": "Wheel Time",
    "description": "iOS and Expo wheel-styled scrollable date & time selector featuring independent date, hour, minute, and AM/PM columns with live schedule readout.",
    "filePath": "src/components/ui/date-picker.tsx"
  },
  {
    "id": "date-picker-simple",
    "name": "Date Picker - Simple",
    "category": "Date Picker",
    "badge": "Simple Picker",
    "description": "Standard popover date picker with calendar trigger button, formatted date string (\"August 19, 2026\"), and clear date action.",
    "filePath": "src/components/ui/date-picker.tsx"
  },
  {
    "id": "date-picker-range",
    "name": "Date Picker - Range",
    "category": "Date Picker",
    "badge": "Date Range",
    "description": "Date range selection trigger button allowing start and end date pick with dual month view on desktop and single month view on mobile screens.",
    "filePath": "src/components/ui/date-picker.tsx"
  },
  {
    "id": "date-picker-presets",
    "name": "Date Picker - Quick Presets",
    "category": "Date Picker",
    "badge": "Presets",
    "description": "Date picker popover featuring sidebar shortcuts (\"Today\", \"Tomorrow\", \"In 3 days\", \"In 1 week\", \"In 1 month\") for quick date selection.",
    "filePath": "src/components/ui/date-picker.tsx"
  },
  {
    "id": "date-picker-form",
    "name": "Date Picker - Form Field",
    "category": "Date Picker",
    "badge": "Form Picker",
    "description": "Date picker input integrated into a form structure with label, description, error validation state, and submit action.",
    "filePath": "src/components/ui/date-picker.tsx"
  },
  {
    "id": "calendar-single",
    "name": "Calendar - Single Selection",
    "category": "Calendar",
    "badge": "Single Day",
    "description": "Standalone interactive calendar grid with month navigation controls, today highlight, single date selection, and selected date info card.",
    "filePath": "src/components/ui/calendar.tsx"
  },
  {
    "id": "calendar-range",
    "name": "Calendar - Range Selection",
    "category": "Calendar",
    "badge": "Range Span",
    "description": "Multi-day range selection calendar grid with highlighted start date, end date, and intermediate range span.",
    "filePath": "src/components/ui/calendar.tsx"
  },
  {
    "id": "calendar-events",
    "name": "Calendar - Event & Schedule View",
    "category": "Calendar",
    "badge": "Agenda View",
    "description": "Responsive event calendar view featuring dated indicators, agenda list panel, team tags, and Google Calendar sync status.",
    "filePath": "src/components/ui/calendar.tsx"
  },
  {
    "id": "minimal-tiptap-editor",
    "name": "Minimal Tiptap Editor",
    "category": "Rich Editor",
    "badge": "Editor",
    "description": "Feature-rich WYSIWYG rich text editor with toolbar for formatting, headings, lists, code blocks, and full post reader preview.",
    "filePath": "src/components/ui/minimal-tiptap/minimal-tiptap.tsx"
  },
  {
    "id": "lucide-icons-gallery",
    "name": "Lucide Icons Gallery",
    "category": "Theme",
    "badge": "Icons",
    "description": "Complete interactive catalog of all Lucide icons used across the app with search, category filters, size adjustments, and click-to-copy JSX imports.",
    "filePath": "src/features/MessageComponentGallery/previews/LucideIconsPreview.tsx"
  },
  {
    "id": "app-themes-settings",
    "name": "App Theme & Colors",
    "category": "Theme",
    "badge": "Theme",
    "description": "Theme customizer from email settings featuring Catppuccin, Tokyo Night, Dracula, Nord, Gruvbox, Supabase, and dynamic CSS primary tokens.",
    "filePath": "src/features/email-settings/components/themes-tab.tsx"
  },
  {
    "id": "primitive-button",
    "name": "Button",
    "category": "Primitives",
    "badge": "Button",
    "description": "Interactive button component with default, secondary, destructive, outline, ghost, link variants, and sm/lg sizing.",
    "filePath": "components/ui/button.tsx"
  },
  {
    "id": "primitive-badge",
    "name": "Badge",
    "category": "Primitives",
    "badge": "Badge",
    "description": "Status indicators and pill badges with default, secondary, outline, and destructive styling.",
    "filePath": "components/ui/badge.tsx"
  },
  {
    "id": "primitive-avatar",
    "name": "Avatar",
    "category": "Primitives",
    "badge": "Avatar",
    "description": "User profile avatar with image loading, fallback initials, online status indicator, and size presets.",
    "filePath": "components/ui/avatar.tsx"
  },
  {
    "id": "primitive-accordion",
    "name": "Accordion",
    "category": "Primitives",
    "badge": "Accordion",
    "description": "Collapsible interactive accordion list for FAQ sections and expandable configuration menus.",
    "filePath": "components/ui/accordion.tsx"
  },
  {
    "id": "primitive-alert",
    "name": "Alert",
    "category": "Primitives",
    "badge": "Alert",
    "description": "Informational, success, warning, and destructive banners.",
    "filePath": "components/ui/alert.tsx"
  },
  {
    "id": "primitive-alert-dialog",
    "name": "Alert Dialog",
    "category": "Primitives",
    "badge": "Dialog",
    "description": "Modal dialog for urgent confirmations and high-priority user actions.",
    "filePath": "components/ui/alert-dialog.tsx"
  },
  {
    "id": "primitive-dialog",
    "name": "Dialog",
    "category": "Primitives",
    "badge": "Dialog",
    "description": "Overlay modal dialog for multi-field forms, settings, and full task flows.",
    "filePath": "components/ui/dialog.tsx"
  },
  {
    "id": "primitive-card",
    "name": "Card",
    "category": "Primitives",
    "badge": "Card",
    "description": "Universal card container with header, description, divider, body metrics, and footer actions.",
    "filePath": "components/ui/card.tsx"
  },
  {
    "id": "primitive-checkbox",
    "name": "Checkbox",
    "category": "Primitives",
    "badge": "Checkbox",
    "description": "Interactive checkbox control for multi-selection and form agreements.",
    "filePath": "components/ui/checkbox.tsx"
  },
  {
    "id": "primitive-input",
    "name": "Input & Textarea",
    "category": "Primitives",
    "badge": "Input",
    "description": "Text input component with icon adornments, validation rings, and multiline textarea.",
    "filePath": "components/ui/input.tsx"
  },
  {
    "id": "primitive-toggle",
    "name": "Toggle & Toggle Group",
    "category": "Primitives",
    "badge": "Toggle",
    "description": "Two-state toggle button and formatting group options.",
    "filePath": "components/ui/toggle.tsx"
  },
  {
    "id": "primitive-tabs",
    "name": "Tabs",
    "category": "Primitives",
    "badge": "Tabs",
    "description": "Interactive multi-pane tab bar with smooth active state transition and themed panels.",
    "filePath": "components/ui/tabs.tsx"
  },
  {
    "id": "primitive-progress",
    "name": "Progress",
    "category": "Primitives",
    "badge": "Progress",
    "description": "Linear progress bar indicating upload status and goal completion.",
    "filePath": "components/ui/progress.tsx"
  },
  {
    "id": "primitive-skeleton",
    "name": "Skeleton",
    "category": "Primitives",
    "badge": "Skeleton",
    "description": "Animated shimmer placeholder elements for content loading states.",
    "filePath": "components/ui/skeleton.tsx"
  },
  {
    "id": "primitive-radio-group",
    "name": "Radio Group",
    "category": "Primitives",
    "badge": "Radio",
    "description": "Single-selection radio group for pricing tiers, plans, and options.",
    "filePath": "components/ui/radio-group.tsx"
  },
  {
    "id": "primitive-select",
    "name": "Select",
    "category": "Primitives",
    "badge": "Select",
    "description": "Dropdown select picker with search filtering and custom option items.",
    "filePath": "components/ui/select.tsx"
  },
  {
    "id": "primitive-menubar",
    "name": "Menubar",
    "category": "Primitives",
    "badge": "Menubar",
    "description": "Desktop-grade horizontal menubar with nested submenus and shortcut bindings.",
    "filePath": "components/ui/menubar.tsx"
  },
  {
    "id": "primitive-popover",
    "name": "Popover",
    "category": "Primitives",
    "badge": "Popover",
    "description": "Floating rich content popover anchored to an interactive trigger element.",
    "filePath": "components/ui/popover.tsx"
  },
  {
    "id": "primitive-tooltip",
    "name": "Tooltip",
    "category": "Primitives",
    "badge": "Tooltip",
    "description": "Helpful contextual tooltip popup on hover or focus.",
    "filePath": "components/ui/tooltip.tsx"
  },
  {
    "id": "primitive-hover-card",
    "name": "Hover Card",
    "category": "Primitives",
    "badge": "Hover Card",
    "description": "Rich profile and preview card displayed on mouse hover.",
    "filePath": "components/ui/hover-card.tsx"
  },
  {
    "id": "primitive-separator",
    "name": "Separator",
    "category": "Primitives",
    "badge": "Separator",
    "description": "Horizontal and vertical divider lines for content hierarchy.",
    "filePath": "components/ui/separator.tsx"
  },
  {
    "id": "primitive-aspect-ratio",
    "name": "Aspect Ratio",
    "category": "Primitives",
    "badge": "Layout",
    "description": "Responsive container maintaining exact aspect ratios (16:9, 4:3, 1:1).",
    "filePath": "components/ui/aspect-ratio.tsx"
  },
  {
    "id": "primitive-collapsible",
    "name": "Collapsible",
    "category": "Primitives",
    "badge": "Collapsible",
    "description": "Interactive expandable section for optional settings and details.",
    "filePath": "components/ui/collapsible.tsx"
  },
  {
    "id": "primitive-text",
    "name": "Text & Typography",
    "category": "Primitives",
    "badge": "Typography",
    "description": "Heading hierarchy (H1-H4), Lead, Paragraph, Blockquote, and Code typography.",
    "filePath": "components/ui/text.tsx"
  },
  {
    "id": "primitive-label",
    "name": "Label",
    "category": "Primitives",
    "badge": "Label",
    "description": "Accessible form field label component.",
    "filePath": "components/ui/label.tsx"
  }
]
