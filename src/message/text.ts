import { Message } from './types.js';

export class TextMessage implements Message
{
	constructor ( public content: string )
	{
	}

	serialize ()
	{
		return {
			content: this.content
		}
	}
}
