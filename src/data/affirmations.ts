import { Category, Thought } from './types';

/**
 * The thought library. Every thought is short, warm and speaks
 * like a caring message from a trusted friend.
 */

export const categories: Category[] = [
  { id: 'selbstliebe', title: 'Selbstliebe' },
  { id: 'motivation', title: 'Motivation' },
  { id: 'dankbarkeit', title: 'Dankbarkeit' },
  { id: 'gelassenheit', title: 'Gelassenheit' },
  { id: 'achtsamkeit', title: 'Achtsamkeit' },
  { id: 'beziehungen', title: 'Beziehungen' },
  { id: 'mut', title: 'Mut' },
  { id: 'erfolg', title: 'Erfolg' },
  { id: 'gesundheit', title: 'Gesundheit' },
];

export function categoryTitle(categoryId: string): string {
  return categories.find((c) => c.id === categoryId)?.title ?? '';
}

const library: Record<string, string[]> = {
  selbstliebe: [
    'Du bist genug.',
    'Du darfst freundlich zu dir selbst sein.',
    'Dein Wert hängt nicht von Leistung ab.',
    'Du musst heute niemandem beweisen, wer du bist.',
    'Du bist genug, auch an den Tagen, an denen du es nicht fühlst.',
    'Sprich heute mit dir wie mit einem guten Freund.',
    'Du darfst Raum einnehmen.',
    'Deine Gefühle sind gültig, auch die leisen.',
    'Es ist okay, nicht perfekt zu sein. Niemand ist es.',
    'Du verdienst dieselbe Liebe, die du anderen schenkst.',
    'Du wächst, auch wenn du es gerade nicht siehst.',
    'Heute reicht es, einfach du zu sein.',
  ],
  motivation: [
    'Kleine Schritte bringen dich weiter.',
    'Du bist näher am Ziel als du denkst.',
    'Heute zählt mehr als Perfektion.',
    'Ein kleiner Anfang ist auch ein Anfang.',
    'Du hast schon Schwereres geschafft.',
    'Fang einfach an — der Mut kommt unterwegs.',
    'Jeder Tag ist eine neue Seite. Schreib eine gute Zeile.',
    'Du musst nicht alles heute schaffen. Nur das Nächste.',
    'Dranbleiben ist deine Superkraft.',
    'Auch langsames Vorwärts ist Vorwärts.',
    'Dein zukünftiges Ich dankt dir für heute.',
    'Es muss nicht leicht sein, um sich zu lohnen.',
  ],
  dankbarkeit: [
    'Es gibt bereits vieles in deinem Leben, das trägt.',
    'Dankbarkeit verändert den Blick auf den Tag.',
    'Auch kleine Momente sind wertvoll.',
    'Heute gibt es mindestens eine Sache, die schön ist. Finde sie.',
    'Was du hast, war einmal etwas, das du dir gewünscht hast.',
    'Ein dankbares Herz findet überall kleine Geschenke.',
    'Nimm dir einen Moment für das, was gut ist.',
    'Nicht alles ist selbstverständlich — und das ist schön.',
    'Danke sagen macht zwei Menschen glücklich.',
    'Der Morgenkaffee, das Licht, ein Lächeln: alles zählt.',
    'Es ist genug da, um heute dankbar zu sein.',
    'Was heute klein wirkt, wird morgen eine schöne Erinnerung.',
  ],
  gelassenheit: [
    'Nicht alles braucht heute eine Lösung.',
    'Du darfst loslassen.',
    'Ruhe ist produktiv.',
    'Atme ein. Atme aus. Mehr braucht dieser Moment nicht.',
    'Manches klärt sich, wenn du es lässt.',
    'Du musst nicht auf alles eine Antwort haben.',
    'Der Tag darf langsamer sein als geplant.',
    'Gelassenheit ist keine Schwäche, sie ist Vertrauen.',
    'Was du nicht ändern kannst, darfst du ziehen lassen.',
    'Eine Pause ist kein Stillstand.',
    'Es ist okay, heute einfach nur zu sein.',
    'Nicht jede Welle muss geritten werden.',
  ],
  achtsamkeit: [
    'Dieser Moment ist der einzige, der gerade zählt.',
    'Spür einmal kurz deinen Atem. Du bist hier.',
    'Langsamer gehen heißt mehr sehen.',
    'Heute einmal bewusst hinhören statt nur zuhören.',
    'Der Augenblick ist genug.',
    'Achte heute auf eine kleine schöne Einzelheit.',
    'Du darfst das Tempo herausnehmen.',
    'Ein bewusster Atemzug verändert den ganzen Moment.',
    'Sei dort, wo deine Füße stehen.',
    'Stille ist keine Leere, sie ist Raum.',
    'Nimm den Tag Schluck für Schluck, nicht auf einmal.',
    'Wenn du isst, iss. Wenn du gehst, geh.',
  ],
  beziehungen: [
    'Ein ehrliches Gespräch ist ein Geschenk.',
    'Du darfst um Nähe bitten.',
    'Kleine Gesten tragen große Liebe.',
    'Sag heute jemandem, was er dir bedeutet.',
    'Zuhören ist eine der schönsten Formen von Zuneigung.',
    'Du musst nicht jeder Erwartung gerecht werden.',
    'Gute Beziehungen brauchen keine perfekten Menschen.',
    'Grenzen zu setzen ist auch Beziehungspflege.',
    'Verbundenheit beginnt mit einem kleinen Schritt.',
    'Auch du darfst gehalten werden.',
    'Ein Lächeln findet fast immer einen Weg zurück.',
    'Menschen vergessen Worte, aber nie, wie du ihnen begegnet bist.',
  ],
  mut: [
    'Mut ist leise. Er sagt: Ich versuche es.',
    'Du darfst Fehler machen und trotzdem weitergehen.',
    'Hinter deiner Angst wartet oft etwas Gutes.',
    'Trau dich, heute eine kleine Sache anders zu machen.',
    'Neues beginnt immer mit Unsicherheit. Das ist normal.',
    'Du bist mutiger, als du dich fühlst.',
    'Ein Nein zu anderen kann ein Ja zu dir sein.',
    'Wachstum wohnt außerhalb des Vertrauten.',
    'Du musst nicht furchtlos sein, um mutig zu sein.',
    'Jedes Mal, wenn du es versuchst, wächst du.',
    'Der erste Schritt zählt doppelt.',
    'Deine Stimme darf gehört werden.',
  ],
  erfolg: [
    'Erfolg ist auch, heute weitergemacht zu haben.',
    'Vergleiche dich mit dir von gestern, nicht mit anderen.',
    'Du darfst stolz auf deinen Weg sein.',
    'Kleine Siege sind echte Siege.',
    'Was du regelmäßig tust, formt dein Leben.',
    'Geduld ist Teil jedes großen Ziels.',
    'Dein Weg muss niemandem außer dir gefallen.',
    'Rückschläge sind Kapitel, nicht das Ende der Geschichte.',
    'Du säst heute, was du später erntest.',
    'Genug getan zu haben ist auch ein Erfolg.',
    'Träume groß, beginne klein, starte jetzt.',
    'Dein Bestes ist genug — und es verändert sich täglich.',
  ],
  gesundheit: [
    'Dein Körper trägt dich jeden Tag. Sei gut zu ihm.',
    'Erholung ist Teil der Stärke.',
    'Ein Glas Wasser, ein Spaziergang, ein tiefer Atemzug: Fürsorge ist einfach.',
    'Schlaf ist keine verlorene Zeit.',
    'Höre heute einmal bewusst auf deinen Körper.',
    'Bewegung ist ein Geschenk an dich selbst.',
    'Auch Pausen halten dich gesund.',
    'Dein Wohlbefinden hat Priorität verdient.',
    'Gesundheit wächst aus vielen kleinen Entscheidungen.',
    'Du darfst dir Zeit für dich nehmen — ohne schlechtes Gewissen.',
    'Ein ruhiger Geist heilt vieles mit.',
    'Iss, schlaf und atme, als würdest du dich lieben. Denn das tust du.',
  ],
};

export const thoughts: Thought[] = Object.entries(library).flatMap(([categoryId, texts]) =>
  texts.map((text, index) => ({
    id: `${categoryId}-${index + 1}`,
    categoryId,
    text,
  }))
);

export function thoughtById(id: string): Thought | undefined {
  return thoughts.find((t) => t.id === id);
}
