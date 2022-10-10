import Note from './Note';
import NoteText, { DocumentNode } from './NoteText';

describe('create', () => {
  test('creates a new note with a random id', () => {
    const text: DocumentNode = {
      type: 'doc',
      content: [{ type: 'paragraph', content: [] }],
    };
    const note = Note.create({
      text: new NoteText(text),
    });
    expect(note.text.document).toEqual(text);
    expect(
      note.equals(
        Note.create({
          text: new NoteText(text),
        })
      )
    ).toEqual(false);
  });
});
