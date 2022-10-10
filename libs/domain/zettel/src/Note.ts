import { Entity } from "@zettelmaster/domain/base";
import NoteText from "./NoteText";

export interface NoteData {
	text: NoteText
}

/** Represents a zettel note and its references and links. */
export default class Note extends Entity<NoteData> {
}