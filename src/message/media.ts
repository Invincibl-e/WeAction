import { Message } from "./types.js";


export class MediaMessage implements Message
{
	constructor ( public id: string )
	{
	}

	serialize ()
	{
		return {
			media_id: this.id
		};
	}
}
