import { Message }              from './types.js';
import { JumpAction, JumpType } from "./action.js";


export namespace Card
{
	export enum Type
	{
		NOTICE = 'text_notice',
		NEWS   = 'news_notice'
	}

	export enum SourceColor
	{
		GRAY  = 0,
		BLACK = 1,
		RED   = 2,
		GREEN = 3
	}

	export class Source
	{
		constructor ( public icon?: string, public text?: string, public color = SourceColor.GRAY )
		{
		}

		serialize ()
		{
			return {
				icon_url: this.icon,
				desc    : this.text,
				desc_color: this.color
			};
		}
	}

	export class Title
	{
		constructor ( public title?: string, public desc?: string )
		{
		}

		serialize ()
		{
			return {
				title: this.title,
				desc : this.desc
			};
		}
	}

	export class Image
	{
		constructor ( public url?: string, public aspect_ratio = 0.0 )
		{
		}

		serialize ()
		{
			return {
				url: this.url,
				aspect_ratio: this.aspect_ratio
			};
		}
	}

	export class ImageText
	{
		constructor ( public title?: string, public desc?: string, public url?: string, public action?: JumpAction )
		{
		}

		serialize ()
		{
			return {
				title: this.title,
				desc : this.desc,
				url  : this.url,
				...this.action?.serialize()
			};
		}
	}

	export class Quote
	{
		constructor ( public title: string, public text: string, public action: JumpAction )
		{
		}

		serialize ()
		{
			return {
				title: this.title,
				quote_text: this.text,
				...this.action.serialize()
			};
		}
	}

	export enum RichContentType
	{
		NONE = 0,
		URL,
		FILE,
	}

	export abstract class RichContent
	{
		constructor ( public type: RichContentType, public prefix: string, public text: string )
		{
		}

		abstract _serialize (): object;

		serialize ()
		{
			return {
				keyname: this.prefix,
				value: this.text,
				type: this.type,
				...this._serialize()
			};
		}
	}

	export class UrlContent extends RichContent
	{
		constructor ( prefix: string, text: string, public url: string )
		{
			super ( RichContentType.URL, prefix, text );
		}

		_serialize ()
		{
			return {
				url: this.url
			};
		}
	}

	export class FileContent extends RichContent
	{
		constructor ( prefix: string, text: string, public media_id: string )
		{
			super ( RichContentType.FILE, prefix, text );
		}

		_serialize ()
		{
			return {
				media_id: this.media_id
			};
		}
	}
}

export class NoticeCardMessage implements Message
{
	source?: Card.Source;
	main?: Card.Title;
	emphasis?: Card.Title;
	quote?: Card.Quote;
	sub_title?: string;
	contents?: Card.RichContent[];
	jumps?: JumpAction[];
	action?: JumpAction;

	constructor ( {
		source,
		main,
		emphasis,
		quote,
		sub_title,
		contents,
		jumps,
		action,
	}: {
		source?: Card.Source;
		main?: Card.Title;
		emphasis?: Card.Title;
		quote?: Card.Quote;
		sub_title?: string;
		contents?: Card.RichContent[];
		jumps?: JumpAction[];
		action?: JumpAction;
	} = {} )
	{
		this.source    = source;
		this.main      = main;
		this.emphasis  = emphasis;
		this.quote     = quote;
		this.sub_title = sub_title;
		this.contents  = contents;
		this.jumps     = jumps;
		this.action    = action;
	}

	serialize (): object
	{
		return {
			card_type              : Card.Type.NOTICE,
			source                 : this.source?.serialize (),
			main_title             : this.main?.serialize (),
			emphasis_content       : this.emphasis?.serialize (),
			quote_area             : this.quote?.serialize (),
			sub_title_text         : this.sub_title,
			horizontal_content_list: this.contents?.map ( content => content.serialize () ),
			jump_list              : this.jumps?.map ( jump => jump.serialize () ),
			card_action            : this.action?.serialize ()
		};
	}
}

export class NewsCardMessage implements Message
{
	source?: Card.Source;
	main?: Card.Title;
	image?: Card.Image;
	image_text?: Card.ImageText;
	quote?: Card.Quote;
	vertical?: Card.RichContent[];
	horizontal?: Card.RichContent[];
	jumps?: JumpAction[];
	action?: JumpAction;

	constructor ( {
		source,
		main,
		image,
		image_text,
		quote,
		vertical,
		horizontal,
		jumps,
		action,
	}: {
		source?: Card.Source;
		main?: Card.Title;
		image?: Card.Image;
		image_text?: Card.ImageText;
		quote?: Card.Quote;
		vertical?: Card.RichContent[];
		horizontal?: Card.RichContent[];
		jumps?: JumpAction[];
		action?: JumpAction;
	} = {} )
	{
		this.source    = source;
		this.main      = main;
		this.image     = image;
		this.image_text = image_text;
		this.quote     = quote;
		this.vertical  = vertical;
		this.horizontal = horizontal;
		this.jumps     = jumps;
		this.action    = action;
	}

	serialize (): object
	{
		return {
			card_type              : Card.Type.NEWS,
			source                 : this.source?.serialize (),
			main_title             : this.main?.serialize (),
			card_image             : this.image?.serialize (),
			image_text_area        : this.image_text?.serialize (),
			quote_area             : this.quote?.serialize (),
			vertical_content_list  : this.vertical?.map ( content => content.serialize () ),
			horizontal_content_list: this.horizontal?.map ( content => content.serialize () ),
			jump_list              : this.jumps?.map ( jump => jump.serialize () ),
			card_action            : this.action?.serialize ()
		};
	}
}

