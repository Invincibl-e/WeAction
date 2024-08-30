import { getInput } from '@actions/core';
import { glob } from 'glob';

import { UploadType, WebhookApi } from '../src/WebhookApi.js';

async function run ()
{
	const key = getInput ( 'key' ) || process.env.WECOM_WEBHOOK_KEY || process.env.WECOM_KEY
	if ( !key )
	{
		throw new Error ( 'token is required' )
	}

	const api = new WebhookApi ( key )

	const type = getInput ( 'type' ) as UploadType

	const files = (
		await Promise.all ( getInput ( 'files' ).split ( '\n' ).map ( file => glob ( file ) ) )
	).flat ();

	const ids = await Promise.all ( files.map ( async file =>
	{
		const { id } = await api.upload ( type, file )
		return `${file},${id}`
	} ) )

	return ids.join ( "\n" )
}

run ()
