import axios, { AxiosInstance } from "axios";
import fs from 'fs';
import mime from 'mime-types';
import FormData from 'form-data'; // 引入 FormData

import { TextMessage, MessageType, Message } from "./message/index.js";


const BASE_URL = 'https://qyapi.weixin.qq.com/cgi-bin/webhook/';

export enum UploadType {
	IMAGE = 'image',
	VOICE = 'voice',
	VIDEO = 'video',
	FILE  = 'file',
}

export class WebhookApi
{
	private axios: AxiosInstance;

	constructor ( key: string )
	{
		this.axios = axios.create ( {
			baseURL: BASE_URL,
			params : {
				key: key
			}
		} );
	}

	async upload ( type: UploadType, file: string, name?: string )
	{
		if ( !name )
		{
			name = file;
		}

		const formData = new FormData ();
		const fileStream = fs.createReadStream ( file );
		formData.append ( 'media', fileStream, {
			filename   : name,
			knownLength : ( await fs.promises.stat ( file ) ).size,
			contentType: mime.contentType ( file ) || undefined
		} );

		const response = await this.axios.post ( 'upload_media', formData, {
			headers: {
				...formData.getHeaders ()
			},
			params : {
				type
			}
		} );

		if ( response.data.errcode !== 0 )
		{
			throw new Error ( response.data.errmsg );
		}

		const { media_id, created_at } = response.data;

		return {
			id: media_id,
			at: created_at
		};
	}

	async send ( type: MessageType, message: Message )
	{
		const response = await this.axios.post ( 'send', {
			msgtype: type,
			[ type ] : message.serialize ()
		}, {
			headers: {
				'Content-Type': 'application/json'
			}
		} );

		if ( response.data.errcode !== 0 )
		{
			throw new Error ( response.data.errmsg );
		}

		return response.data;
	}

	async sendText ( content: string )
	{
		return await this.send ( MessageType.TEXT, new TextMessage ( content ) );
	}

	async sendCard ( message: Message )
	{
		return await this.send ( MessageType.CARD, message );
	}
}
