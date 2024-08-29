export enum MessageType {
	TEXT     = 'text',
	MARKDOWN = 'markdown',
	IMAGE    = 'image',
	NEWS     = 'news',
	FILE     = 'file',
	VOICE    = 'voice',
	CARD     = 'template_card',
}

export interface Message {
	serialize (): object;
}
