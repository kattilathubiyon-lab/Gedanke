-- =============================================================================
-- Optionale Beispieldaten für den Prototyp
-- =============================================================================
-- Diese Briefe werden hier BEWUSST von einem Menschen (dir, beim Ausführen des
-- Seeds) direkt als 'approved' eingespielt. Das ist KEIN Auto-Publish-Pfad:
-- Über die App eingereichte Briefe bleiben immer 'pending', bis ein Admin sie
-- freigibt. Der Seed dient nur dazu, dass beim ersten Start etwas zu lesen da
-- ist.
--
-- Ausführen z. B. im Supabase SQL Editor oder per `supabase db reset`
-- (führt Migrationen + seed.sql aus).
-- =============================================================================

insert into public.letters (content, author_alias, status, tags, reviewed_at)
values
  (
    E'Liebe:r Unbekannte:r,\n\nfalls dieser Tag sich anfühlt wie ein zu enger Mantel: Du darfst ihn ausziehen. Nicht alles muss heute gelingen. Dass du noch da bist und liest, ist schon genug.\n\nMorgen ist ein neues, leeres Blatt. Wir schreiben es zusammen, ein Wort nach dem anderen.',
    'Jemand, der viele graue Tage kennt',
    'approved',
    array['hoffnung', 'geduld'],
    now()
  ),
  (
    E'Hey du,\n\nich weiß nicht, was dich gerade beschäftigt. Aber ich weiß: Gefühle sind wie Wetter. Auch der schwerste Himmel zieht irgendwann weiter. Halt noch ein bisschen durch. Du musst es nicht allein tragen.',
    null,
    'approved',
    array['durchhalten'],
    now()
  ),
  (
    E'An dich,\n\nvor ein paar Jahren dachte ich, es wird nie wieder leicht. Heute lache ich wieder – nicht jeden Tag, aber oft genug. Der Weg dahin war krumm und langsam. Er hat sich gelohnt. Deiner wird sich auch lohnen.',
    'C.',
    'approved',
    array['zuversicht', 'genesung'],
    now()
  );
