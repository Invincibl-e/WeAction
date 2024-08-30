import { getInput, setFailed } from '@actions/core';

import { WebhookApi }  from '../../src/WebhookApi.js';
import { Card, NoticeCardMessage, UrlJumpAction } from "../../src/message";


async function run ()
{
	const key = getInput ( 'key' ) || process.env.WECOM_WEBHOOK_KEY || process.env.WECOM_KEY
	if ( !key )
	{
		throw new Error ( 'ken is required' )
	}

	const api = new WebhookApi ( key )

	let source = JSON.parse ( getInput ( 'source' ) )
	source = source ? new Card.Source ( source.icon, source.desc, Card.SourceColor [ source.color as keyof typeof Card.SourceColor ] ) : undefined

	let main = JSON.parse ( getInput ( 'main' ) )
	main = main ? new Card.Title ( main.title, main.desc ) : undefined

	let emphasis = JSON.parse ( getInput ( 'emphasis' ) )
	emphasis = emphasis ? new Card.Title ( emphasis.title, emphasis.desc ) : undefined

	let action = getInput ( 'action' )
	action = action ? action : `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`

	let fileString = getInput ( 'files' )
	let files: string[][] = []
	if ( fileString )
	{
		files = fileString.split ( '\n' ).map ( info => info.split ( ',' ) )
	}
	const filesGroup = []
	for ( let i = 0; i < files.length; i += 6 )
	{
		filesGroup.push ( files.slice ( i, i + 6 ) )
	}

	const message = new NoticeCardMessage ( {
		source,
		main,
		emphasis,
		contents: filesGroup [ 0 ].map ( info => new Card.FileContent ( " ", info [ 0 ], info [ 1 ] ) ),
		action: new UrlJumpAction ( action )
	} )

	const response = await api.sendCard ( message )
	if ( response.data.errcode !== 0 )
	{
		throw new Error ( response.data.errmsg )
	}

	if ( filesGroup.length === 1 ) return

	for ( let i = 1; i < filesGroup.length; i++ )
	{
		const message = new NoticeCardMessage ( {
			contents: filesGroup [ i ].map ( info => new Card.FileContent ( " ", info [ 0 ], info [ 1 ] ) ),
			action: new UrlJumpAction ( action )
		} )

		const response = await api.sendCard ( message )
		if ( response.data.errcode !== 0 )
		{
			throw new Error ( response.data.errmsg )
		}
	}
}

run ().catch ( setFailed )
