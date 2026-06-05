-- =============================================================================
-- Companion by Danè — Seed Data (fully schema-verified)
-- =============================================================================
-- UUIDs:
--   Sarah Mitchell  →  1d791b66-55fe-4841-942d-b43f252cb6f9
--   James Okonkwo   →  9401272b-cb98-420a-a9ad-f317b037fe33
--   Annika van Zyl  →  28ba1e2f-359d-4d23-929e-633acaa62dcb
--   Lerato Nkosi    →  3e5aa7c0-12d9-4428-b729-df37470029a8
--   Thabo Pietersen →  1b1cf901-2e4b-4e72-a22c-56476e86bfce
-- =============================================================================

-- =============================================================================
-- SECTION 1 — PROFILES (UPDATE existing rows)
-- =============================================================================

UPDATE public.profiles SET full_name='Sarah Mitchell',  phone='+27821234001', language_preference='en', plan='grow'     WHERE id='1d791b66-55fe-4841-942d-b43f252cb6f9';
UPDATE public.profiles SET full_name='James Okonkwo',   phone='+27821234002', language_preference='en', plan='business' WHERE id='9401272b-cb98-420a-a9ad-f317b037fe33';
UPDATE public.profiles SET full_name='Annika van Zyl',  phone='+27821234003', language_preference='af', plan='free'     WHERE id='28ba1e2f-359d-4d23-929e-633acaa62dcb';
UPDATE public.profiles SET full_name='Lerato Nkosi',    phone='+27821234004', language_preference='en', plan='free'     WHERE id='3e5aa7c0-12d9-4428-b729-df37470029a8';
UPDATE public.profiles SET full_name='Thabo Pietersen', phone='+27821234005', language_preference='en', plan='free'     WHERE id='1b1cf901-2e4b-4e72-a22c-56476e86bfce';

-- =============================================================================
-- SECTION 2 — CONVERSATIONS
-- status: active | completed | abandoned
-- mode:   text | voice | voice_playback
-- =============================================================================

INSERT INTO public.conversations (id, user_id, title, mode, language, status, created_at, updated_at) VALUES
  ('cccccccc-0001-0000-0000-000000000001','1d791b66-55fe-4841-942d-b43f252cb6f9','Finding my confidence at work','text','en','completed',now()-interval'30 days',now()-interval'30 days'),
  ('cccccccc-0002-0000-0000-000000000001','1d791b66-55fe-4841-942d-b43f252cb6f9','Setting boundaries with my manager','text','en','completed',now()-interval'21 days',now()-interval'21 days'),
  ('cccccccc-0003-0000-0000-000000000001','1d791b66-55fe-4841-942d-b43f252cb6f9','The inner critic spiral','text','en','completed',now()-interval'14 days',now()-interval'14 days'),
  ('cccccccc-0004-0000-0000-000000000001','1d791b66-55fe-4841-942d-b43f252cb6f9','Preparing for my performance review','voice','en','completed',now()-interval'7 days',now()-interval'7 days'),
  ('cccccccc-0005-0000-0000-000000000001','1d791b66-55fe-4841-942d-b43f252cb6f9','What do I actually want?','text','en','completed',now()-interval'2 days',now()-interval'2 days'),
  ('cccccccc-0001-0000-0000-000000000002','9401272b-cb98-420a-a9ad-f317b037fe33','Leading through uncertainty','text','en','completed',now()-interval'28 days',now()-interval'28 days'),
  ('cccccccc-0002-0000-0000-000000000002','9401272b-cb98-420a-a9ad-f317b037fe33','Difficult conversation with my co-founder','voice','en','completed',now()-interval'20 days',now()-interval'20 days'),
  ('cccccccc-0003-0000-0000-000000000002','9401272b-cb98-420a-a9ad-f317b037fe33','Burnout or boredom?','text','en','completed',now()-interval'13 days',now()-interval'13 days'),
  ('cccccccc-0004-0000-0000-000000000002','9401272b-cb98-420a-a9ad-f317b037fe33','My leadership identity','text','en','completed',now()-interval'6 days',now()-interval'6 days'),
  ('cccccccc-0005-0000-0000-000000000002','9401272b-cb98-420a-a9ad-f317b037fe33','Scaling myself as a leader','text','en','completed',now()-interval'1 day',now()-interval'1 day'),
  ('cccccccc-0001-0000-0000-000000000003','28ba1e2f-359d-4d23-929e-633acaa62dcb','Wie is ek buite my rol?','text','af','completed',now()-interval'25 days',now()-interval'25 days'),
  ('cccccccc-0002-0000-0000-000000000003','28ba1e2f-359d-4d23-929e-633acaa62dcb','Grense stel met liefde','text','af','completed',now()-interval'10 days',now()-interval'10 days'),
  ('cccccccc-0003-0000-0000-000000000003','28ba1e2f-359d-4d23-929e-633acaa62dcb','My purpose beyond productivity','text','en','completed',now()-interval'3 days',now()-interval'3 days'),
  ('cccccccc-0001-0000-0000-000000000004','3e5aa7c0-12d9-4428-b729-df37470029a8','Owning my voice in the room','text','en','completed',now()-interval'22 days',now()-interval'22 days'),
  ('cccccccc-0002-0000-0000-000000000004','3e5aa7c0-12d9-4428-b729-df37470029a8','Imposter syndrome at the exec table','voice','en','completed',now()-interval'15 days',now()-interval'15 days'),
  ('cccccccc-0003-0000-0000-000000000004','3e5aa7c0-12d9-4428-b729-df37470029a8','Redefining success on my own terms','text','en','completed',now()-interval'8 days',now()-interval'8 days'),
  ('cccccccc-0004-0000-0000-000000000004','3e5aa7c0-12d9-4428-b729-df37470029a8','The guilt of ambition','text','en','completed',now()-interval'2 days',now()-interval'2 days'),
  ('cccccccc-0001-0000-0000-000000000005','1b1cf901-2e4b-4e72-a22c-56476e86bfce','Starting over at 40','text','en','completed',now()-interval'12 days',now()-interval'12 days'),
  ('cccccccc-0002-0000-0000-000000000005','1b1cf901-2e4b-4e72-a22c-56476e86bfce','What does courage look like for me?','text','en','completed',now()-interval'4 days',now()-interval'4 days')
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- SECTION 3 — CONVERSATION SUMMARIES
-- =============================================================================

INSERT INTO public.conversation_summaries (id, conversation_id, user_id, summary, key_topics, action_items, generated_by, language, created_at) VALUES
  (gen_random_uuid(),'cccccccc-0001-0000-0000-000000000001','1d791b66-55fe-4841-942d-b43f252cb6f9','Sarah explored the roots of her workplace confidence struggles, tracing them to early experiences of being talked over in meetings. She identified a pattern of shrinking before she even enters the room.',ARRAY['confidence','inner critic','workplace dynamics'],ARRAY['Notice one moment this week where you shrink before speaking','Write down three times you were heard and it went well'],'claude','en',now()-interval'30 days'),
  (gen_random_uuid(),'cccccccc-0002-0000-0000-000000000002','9401272b-cb98-420a-a9ad-f317b037fe33','James unpacked a tense situation with his co-founder around decision-making authority. He recognised his tendency to avoid conflict until it becomes resentment.',ARRAY['co-founder dynamics','conflict avoidance','communication'],ARRAY['Schedule a 30-min alignment conversation with co-founder','Write out what you actually need before the conversation'],'claude','en',now()-interval'20 days'),
  (gen_random_uuid(),'cccccccc-0001-0000-0000-000000000003','28ba1e2f-359d-4d23-929e-633acaa62dcb','Annika het verken wie sy is buite haar professionele rol. Sy het erken dat sy lank haar identiteit aan haar prestasies gekoppel het.',ARRAY['identiteit','doel','selfwaarde'],ARRAY['Skryf drie dinge neer wat jou definieer wat niks met werk te doen het nie','Neem 20 minute vir iets wat jou vreugde gee'],'claude','af',now()-interval'25 days'),
  (gen_random_uuid(),'cccccccc-0002-0000-0000-000000000004','3e5aa7c0-12d9-4428-b729-df37470029a8','Lerato examined the imposter syndrome she experiences at the executive level. She identified that she holds herself to a different standard than her peers.',ARRAY['imposter syndrome','executive presence','self-trust'],ARRAY['List five decisions you made this quarter that had real impact','Challenge one self-doubting thought per day this week'],'claude','en',now()-interval'15 days'),
  (gen_random_uuid(),'cccccccc-0001-0000-0000-000000000005','1b1cf901-2e4b-4e72-a22c-56476e86bfce','Thabo reflected on what it means to start a new chapter at 40. He explored the fear of being behind while acknowledging the wisdom he brings.',ARRAY['reinvention','courage','purpose'],ARRAY['Write a letter to your 25-year-old self','Identify one small courageous action you can take this week'],'claude','en',now()-interval'12 days')
ON CONFLICT DO NOTHING;

-- =============================================================================
-- SECTION 4 — CONVERSATION RATINGS
-- color_tag: green | blue | amber | red | purple
-- =============================================================================

INSERT INTO public.conversation_ratings (id, conversation_id, user_id, rating, color_tag, notes, created_at) VALUES
  (gen_random_uuid(),'cccccccc-0001-0000-0000-000000000001','1d791b66-55fe-4841-942d-b43f252cb6f9',5,'green','This really helped me see the pattern clearly.',now()-interval'30 days'),
  (gen_random_uuid(),'cccccccc-0002-0000-0000-000000000001','1d791b66-55fe-4841-942d-b43f252cb6f9',4,'blue','Good session, gave me a lot to think about.',now()-interval'21 days'),
  (gen_random_uuid(),'cccccccc-0003-0000-0000-000000000001','1d791b66-55fe-4841-942d-b43f252cb6f9',5,'purple','The inner critic reframe was powerful.',now()-interval'14 days'),
  (gen_random_uuid(),'cccccccc-0001-0000-0000-000000000002','9401272b-cb98-420a-a9ad-f317b037fe33',4,'blue','Useful framework for thinking about leadership.',now()-interval'28 days'),
  (gen_random_uuid(),'cccccccc-0002-0000-0000-000000000002','9401272b-cb98-420a-a9ad-f317b037fe33',5,'green','Helped me prepare for a real conversation I was dreading.',now()-interval'20 days'),
  (gen_random_uuid(),'cccccccc-0003-0000-0000-000000000002','9401272b-cb98-420a-a9ad-f317b037fe33',3,'amber','Good but I needed more practical tools.',now()-interval'13 days'),
  (gen_random_uuid(),'cccccccc-0001-0000-0000-000000000003','28ba1e2f-359d-4d23-929e-633acaa62dcb',5,'green','Het my diep laat dink. Baie waardevol.',now()-interval'25 days'),
  (gen_random_uuid(),'cccccccc-0001-0000-0000-000000000004','3e5aa7c0-12d9-4428-b729-df37470029a8',5,'purple','Finally named something I have felt for years.',now()-interval'22 days'),
  (gen_random_uuid(),'cccccccc-0002-0000-0000-000000000004','3e5aa7c0-12d9-4428-b729-df37470029a8',4,'blue','Really valuable. Will relisten to this one.',now()-interval'15 days'),
  (gen_random_uuid(),'cccccccc-0001-0000-0000-000000000005','1b1cf901-2e4b-4e72-a22c-56476e86bfce',4,'green','Felt seen for the first time in a while.',now()-interval'12 days')
ON CONFLICT DO NOTHING;

-- =============================================================================
-- SECTION 5 — BOOKINGS
-- status: scheduled | confirmed | completed | cancelled | no_show | rescheduled
-- =============================================================================

INSERT INTO public.bookings (id, user_id, title, scheduled_at, duration_minutes, status, meeting_url, pre_session_notes, created_at, updated_at) VALUES
  ('dddddddd-0001-0000-0000-000000000001','1d791b66-55fe-4841-942d-b43f252cb6f9','Coaching Session',now()-interval'25 days',60,'completed','https://meet.google.com/abc-def-001','Want to work on confidence before my review.',now()-interval'26 days',now()-interval'25 days'),
  ('dddddddd-0002-0000-0000-000000000001','1d791b66-55fe-4841-942d-b43f252cb6f9','Coaching Session',now()-interval'4 days',60,'completed','https://meet.google.com/abc-def-002','Following up on boundary-setting homework.',now()-interval'5 days',now()-interval'4 days'),
  ('dddddddd-0003-0000-0000-000000000001','1d791b66-55fe-4841-942d-b43f252cb6f9','Coaching Session',now()+interval'7 days',60,'confirmed','https://meet.google.com/abc-def-003',NULL,now(),now()),
  ('dddddddd-0001-0000-0000-000000000002','9401272b-cb98-420a-a9ad-f317b037fe33','Coaching Session',now()-interval'18 days',60,'completed','https://meet.google.com/abc-def-004','Co-founder tension needs addressing.',now()-interval'19 days',now()-interval'18 days'),
  ('dddddddd-0002-0000-0000-000000000002','9401272b-cb98-420a-a9ad-f317b037fe33','Coaching Session',now()+interval'10 days',60,'confirmed','https://meet.google.com/abc-def-005',NULL,now(),now()),
  ('dddddddd-0001-0000-0000-000000000003','28ba1e2f-359d-4d23-929e-633acaa62dcb','Coaching Session',now()-interval'20 days',60,'completed','https://meet.google.com/abc-def-006','Identiteit en doel bespreking.',now()-interval'21 days',now()-interval'20 days'),
  ('dddddddd-0002-0000-0000-000000000003','28ba1e2f-359d-4d23-929e-633acaa62dcb','Coaching Session',now()+interval'14 days',60,'confirmed','https://meet.google.com/abc-def-007',NULL,now(),now()),
  ('dddddddd-0001-0000-0000-000000000004','3e5aa7c0-12d9-4428-b729-df37470029a8','Coaching Session',now()-interval'12 days',60,'completed','https://meet.google.com/abc-def-008','Imposter syndrome at exec level.',now()-interval'13 days',now()-interval'12 days'),
  ('dddddddd-0002-0000-0000-000000000004','3e5aa7c0-12d9-4428-b729-df37470029a8','Coaching Session',now()+interval'5 days',60,'confirmed','https://meet.google.com/abc-def-009',NULL,now(),now()),
  ('dddddddd-0001-0000-0000-000000000005','1b1cf901-2e4b-4e72-a22c-56476e86bfce','Coaching Session',now()-interval'8 days',60,'completed','https://meet.google.com/abc-def-010','First session — getting started.',now()-interval'9 days',now()-interval'8 days')
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- SECTION 6 — HOMEWORK
-- homework_type: exercise | reflection | reading | practice | goal_setting | other
-- status:        pending | in_progress | submitted | reviewed | skipped
-- assigned_by:   Dane de Klerk (30e904de-2252-4cc7-9d40-ff09ee3614b0)
-- =============================================================================

INSERT INTO public.homework (id, user_id, assigned_by, title, description, homework_type, due_date, status, coach_feedback, coach_feedback_at, created_at, updated_at) VALUES
  (gen_random_uuid(),'1d791b66-55fe-4841-942d-b43f252cb6f9','30e904de-2252-4cc7-9d40-ff09ee3614b0','The Confidence Audit','List 5 moments from the past month where you showed up confidently — even if only for a moment.','reflection',current_date-20,'reviewed','Sarah, this list is gold. Notice how many of these moments happened when you stopped thinking about how you were being perceived. That is the thread to pull.',now()-interval'18 days',now()-interval'22 days',now()-interval'18 days'),
  (gen_random_uuid(),'1d791b66-55fe-4841-942d-b43f252cb6f9','30e904de-2252-4cc7-9d40-ff09ee3614b0','Boundary Script Practice','Write out a boundary you need to set with your manager. Then say it out loud three times.','practice',current_date-5,'submitted',NULL,NULL,now()-interval'7 days',now()-interval'2 days'),
  (gen_random_uuid(),'9401272b-cb98-420a-a9ad-f317b037fe33','30e904de-2252-4cc7-9d40-ff09ee3614b0','Leadership Values Map','Identify your top 5 leadership values and write one sentence on how each shows up in your current role.','reflection',current_date-10,'reviewed','James — the gap between courage as a value and avoiding the co-founder conversation is exactly where the work is. Well identified.',now()-interval'8 days',now()-interval'15 days',now()-interval'8 days'),
  (gen_random_uuid(),'9401272b-cb98-420a-a9ad-f317b037fe33','30e904de-2252-4cc7-9d40-ff09ee3614b0','The Difficult Conversation Plan','Use the framework we discussed to plan your co-founder conversation: Context, Impact, Request.','practice',current_date+3,'pending',NULL,NULL,now()-interval'5 days',now()-interval'5 days'),
  (gen_random_uuid(),'28ba1e2f-359d-4d23-929e-633acaa62dcb','30e904de-2252-4cc7-9d40-ff09ee3614b0','Die Energie Oudit','Hou vir een week by: watter aktiwiteite gee jou energie en watter neem dit weg? Skryf dit daagliks neer.','reflection',current_date-8,'reviewed','Annika, jou eerlikheid oor hoe uitgeput jy raak van vergaderings wat niks bereik nie is insiggewend. Kom ons praat oor hoe om jou kalender te beskerm.',now()-interval'6 days',now()-interval'12 days',now()-interval'6 days'),
  (gen_random_uuid(),'3e5aa7c0-12d9-4428-b729-df37470029a8','30e904de-2252-4cc7-9d40-ff09ee3614b0','The Evidence File','Start collecting concrete evidence of your impact. Save emails, feedback, outcomes — anything that proves you belong at the table.','practice',current_date+7,'pending',NULL,NULL,now()-interval'4 days',now()-interval'4 days'),
  (gen_random_uuid(),'1b1cf901-2e4b-4e72-a22c-56476e86bfce','30e904de-2252-4cc7-9d40-ff09ee3614b0','Letter to My Younger Self','Write a letter to your 25-year-old self. What do you know now that he needed to hear?','reflection',current_date+5,'pending',NULL,NULL,now()-interval'3 days',now()-interval'3 days')
ON CONFLICT DO NOTHING;

-- =============================================================================
-- SECTION 7 — GOALS
-- category: confidence | voice | leadership | purpose | relationships | career | wellbeing | other
-- status:   active | achieved | paused | abandoned
-- =============================================================================

INSERT INTO public.goals (id, user_id, title, category, target_date, progress_pct, status, created_at, updated_at) VALUES
  (gen_random_uuid(),'1d791b66-55fe-4841-942d-b43f252cb6f9','Speak up in every meeting this month','confidence',current_date+14,60,'active',now()-interval'20 days',now()-interval'2 days'),
  (gen_random_uuid(),'1d791b66-55fe-4841-942d-b43f252cb6f9','Set one clear boundary with my manager','other',current_date+7,40,'active',now()-interval'15 days',now()-interval'3 days'),
  (gen_random_uuid(),'1d791b66-55fe-4841-942d-b43f252cb6f9','Stop apologising before sharing ideas','voice',current_date+30,25,'active',now()-interval'10 days',now()-interval'1 day'),
  (gen_random_uuid(),'9401272b-cb98-420a-a9ad-f317b037fe33','Have the co-founder alignment conversation','leadership',current_date+5,70,'active',now()-interval'18 days',now()-interval'2 days'),
  (gen_random_uuid(),'9401272b-cb98-420a-a9ad-f317b037fe33','Define my leadership identity statement','leadership',current_date+21,50,'active',now()-interval'12 days',now()-interval'4 days'),
  (gen_random_uuid(),'9401272b-cb98-420a-a9ad-f317b037fe33','Delegate one major responsibility this quarter','leadership',current_date+45,20,'active',now()-interval'5 days',now()-interval'1 day'),
  (gen_random_uuid(),'28ba1e2f-359d-4d23-929e-633acaa62dcb','Discover one identity outside of work','other',current_date+30,35,'active',now()-interval'20 days',now()-interval'5 days'),
  (gen_random_uuid(),'28ba1e2f-359d-4d23-929e-633acaa62dcb','Protect two mornings per week for deep work','wellbeing',current_date+14,55,'active',now()-interval'10 days',now()-interval'2 days'),
  (gen_random_uuid(),'3e5aa7c0-12d9-4428-b729-df37470029a8','Contribute confidently in board meetings','confidence',current_date+30,45,'active',now()-interval'15 days',now()-interval'3 days'),
  (gen_random_uuid(),'3e5aa7c0-12d9-4428-b729-df37470029a8','Build my personal evidence file','confidence',current_date+14,10,'active',now()-interval'4 days',now()-interval'1 day'),
  (gen_random_uuid(),'3e5aa7c0-12d9-4428-b729-df37470029a8','Rewrite my definition of success','purpose',current_date-5,100,'achieved',now()-interval'30 days',now()-interval'5 days'),
  (gen_random_uuid(),'1b1cf901-2e4b-4e72-a22c-56476e86bfce','Clarify what I want in this next chapter','purpose',current_date+21,30,'active',now()-interval'10 days',now()-interval'2 days'),
  (gen_random_uuid(),'1b1cf901-2e4b-4e72-a22c-56476e86bfce','Take one courageous action this month','confidence',current_date+20,15,'active',now()-interval'5 days',now()-interval'1 day')
ON CONFLICT DO NOTHING;

-- =============================================================================
-- SECTION 8 — JOURNAL ENTRIES
-- entry_type: reflection | homework | goal | win | challenge | gratitude
-- mood:       great | good | neutral | low | struggling
-- =============================================================================

INSERT INTO public.journal_entries (id, user_id, title, body, entry_type, mood, mood_score, created_at, updated_at) VALUES
  (gen_random_uuid(),'1d791b66-55fe-4841-942d-b43f252cb6f9','I actually said something today','In the team meeting I shared my idea before anyone else could. It felt terrifying for about 3 seconds and then it just felt normal. Small win but it felt huge.','win','great',8,now()-interval'5 days',now()-interval'5 days'),
  (gen_random_uuid(),'1d791b66-55fe-4841-942d-b43f252cb6f9','Grateful for this process','I am grateful for having a space to think through these things without being judged. I feel clearer than I have in months.','gratitude','great',9,now()-interval'2 days',now()-interval'2 days'),
  (gen_random_uuid(),'9401272b-cb98-420a-a9ad-f317b037fe33','The co-founder conversation went better than expected','We talked for two hours. It was uncomfortable at first but we got to something real. I think we needed this for months.','win','great',8,now()-interval'3 days',now()-interval'3 days'),
  (gen_random_uuid(),'9401272b-cb98-420a-a9ad-f317b037fe33','Reflecting on what kind of leader I want to be','I keep coming back to the word honest. I want to be the leader who tells people the truth even when it is hard.','reflection','good',6,now()-interval'7 days',now()-interval'7 days'),
  (gen_random_uuid(),'28ba1e2f-359d-4d23-929e-633acaa62dcb','Ek het vandag geverf','Vir die eerste keer in jare het ek net gesit en verf — nie vir iemand anders nie, net vir myself. Ek het vergeet hoe dit voel.','win','great',9,now()-interval'6 days',now()-interval'6 days'),
  (gen_random_uuid(),'28ba1e2f-359d-4d23-929e-633acaa62dcb','Nagedink oor grense','Ek besef dat ek ja sê uit skuldgevoel, nie uit keuse nie. Dit is n groot onderskeid. Ek wil begin om bewustelik te kies.','reflection','neutral',6,now()-interval'9 days',now()-interval'9 days'),
  (gen_random_uuid(),'3e5aa7c0-12d9-4428-b729-df37470029a8','I belong here','Said it to myself in the mirror this morning. Did not fully believe it yet. But I said it. That is a start.','reflection','good',7,now()-interval'4 days',now()-interval'4 days'),
  (gen_random_uuid(),'1b1cf901-2e4b-4e72-a22c-56476e86bfce','What 40 actually means','I have been so focused on what I have not done. But I realise I have survived things that would have broken a lot of people. That is worth something.','reflection','good',7,now()-interval'8 days',now()-interval'8 days')
ON CONFLICT DO NOTHING;

-- =============================================================================
-- SECTION 9 — NOTIFICATIONS
-- type: summary_ready | homework_assigned | homework_due | booking_confirmed |
--        booking_reminder_24h | booking_reminder_1h | booking_cancelled |
--        invoice_paid | invoice_failed | account_suspended |
--        token_limit_warning | token_limit_reached | quote_of_day |
--        coach_feedback | goal_achieved | insight_detected | system
-- =============================================================================

INSERT INTO public.notifications (id, user_id, type, title, body, read, created_at) VALUES
  (gen_random_uuid(),'1d791b66-55fe-4841-942d-b43f252cb6f9','system','Welcome to Companion','Your coaching journey starts here. I am glad you are here.',true,now()-interval'30 days'),
  (gen_random_uuid(),'1d791b66-55fe-4841-942d-b43f252cb6f9','homework_assigned','New homework assigned','The Confidence Audit is ready for you.',true,now()-interval'22 days'),
  (gen_random_uuid(),'1d791b66-55fe-4841-942d-b43f252cb6f9','booking_confirmed','Session confirmed','Your coaching session is confirmed for next week.',true,now()-interval'8 days'),
  (gen_random_uuid(),'1d791b66-55fe-4841-942d-b43f252cb6f9','coach_feedback','Coach feedback received','Dane has responded to your Confidence Audit.',false,now()-interval'1 day'),

  (gen_random_uuid(),'9401272b-cb98-420a-a9ad-f317b037fe33','system','Welcome to Companion','Your coaching journey starts here. I am glad you are here.',true,now()-interval'28 days'),
  (gen_random_uuid(),'9401272b-cb98-420a-a9ad-f317b037fe33','homework_assigned','New homework assigned','Leadership Values Map is ready for you.',true,now()-interval'15 days'),
  (gen_random_uuid(),'9401272b-cb98-420a-a9ad-f317b037fe33','booking_confirmed','Session confirmed','Your next coaching session is booked.',false,now()-interval'2 days'),

  (gen_random_uuid(),'28ba1e2f-359d-4d23-929e-633acaa62dcb','system','Welkom by Companion','Jou reis begin hier. Ek is bly jy is hier.',true,now()-interval'25 days'),
  (gen_random_uuid(),'28ba1e2f-359d-4d23-929e-633acaa62dcb','homework_assigned','Nuwe huiswerk toegewys','Die Energie Oudit wag vir jou.',true,now()-interval'12 days'),
  (gen_random_uuid(),'28ba1e2f-359d-4d23-929e-633acaa62dcb','booking_confirmed','Sessie bevestig','Jou volgende sessie is bespreek.',false,now()-interval'1 day'),

  (gen_random_uuid(),'3e5aa7c0-12d9-4428-b729-df37470029a8','system','Welcome to Companion','Your coaching journey starts here. I am glad you are here.',true,now()-interval'22 days'),
  (gen_random_uuid(),'3e5aa7c0-12d9-4428-b729-df37470029a8','goal_achieved','Goal completed!','You rewrote your definition of success. That is a big deal.',false,now()-interval'5 days'),
  (gen_random_uuid(),'3e5aa7c0-12d9-4428-b729-df37470029a8','booking_confirmed','Session confirmed','Your next coaching session is booked.',false,now()-interval'2 days'),

  (gen_random_uuid(),'1b1cf901-2e4b-4e72-a22c-56476e86bfce','system','Welcome to Companion','Your coaching journey starts here. I am glad you are here.',true,now()-interval'12 days'),
  (gen_random_uuid(),'1b1cf901-2e4b-4e72-a22c-56476e86bfce','token_limit_warning','Conversation limit','You have used 4 of your 5 free conversations this month.',false,now()-interval'3 days')
ON CONFLICT DO NOTHING;

-- =============================================================================
-- SECTION 10 — QUOTES
-- category: confidence | purpose | leadership | resilience | mindfulness |
--            growth | relationships | voice | general
-- source:   ai | dane | curated
-- =============================================================================

INSERT INTO public.quotes (id, quote_text, author, category, language, source, is_active, created_at) VALUES
  (gen_random_uuid(),'Confidence is not the absence of doubt. It is the decision that something else matters more.','Danè de Klerk','confidence','en','dane',true,now()-interval'60 days'),
  (gen_random_uuid(),'You do not need permission to take up space. You never did.','Danè de Klerk','confidence','en','dane',true,now()-interval'55 days'),
  (gen_random_uuid(),'The version of you that is waiting for the right moment will wait forever. This is the moment.','Danè de Klerk','growth','en','dane',true,now()-interval'50 days'),
  (gen_random_uuid(),'Growth does not feel like growth when you are inside it. It feels like discomfort. That is the point.','Danè de Klerk','growth','en','dane',true,now()-interval'45 days'),
  (gen_random_uuid(),'Your past does not determine your identity. It informs it. You get to decide the rest.','Danè de Klerk','purpose','en','dane',true,now()-interval'40 days'),
  (gen_random_uuid(),'The most courageous thing you can do is tell the truth — starting with yourself.','Danè de Klerk','general','en','dane',true,now()-interval'35 days'),
  (gen_random_uuid(),'Difficult conversations are not the enemy of connection. Avoided ones are.','Danè de Klerk','relationships','en','dane',true,now()-interval'30 days'),
  (gen_random_uuid(),'Leadership is not about having all the answers. It is about asking better questions.','Danè de Klerk','leadership','en','dane',true,now()-interval'25 days'),
  (gen_random_uuid(),'Rest is not a reward for hard work. It is a requirement for good thinking.','Danè de Klerk','mindfulness','en','dane',true,now()-interval'20 days'),
  (gen_random_uuid(),'The work you do on yourself is the most leveraged investment you will ever make.','Danè de Klerk','purpose','en','dane',true,now()-interval'15 days')
ON CONFLICT DO NOTHING;

-- =============================================================================
-- DONE — Expected rows:
--   conversations          19
--   conversation_summaries  5
--   conversation_ratings   10
--   bookings               10
--   homework                7
--   goals                  13
--   journal_entries         8
--   notifications          15
--   quotes                 10
-- =============================================================================
