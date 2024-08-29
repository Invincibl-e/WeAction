export enum JumpType {
	NONE = 0,
	URL,
	MINI_APP,
}

export abstract class JumpAction {
	abstract type: JumpType;
	abstract _serialize (): object

	serialize ()
	{
		return {
			type: this.type,
			...this._serialize ()
		}
	}
}

export class MiniAppJumpAction extends JumpAction {
	constructor ( public appid: string, public pagepath: string )
	{
		super ();
	}

	type: JumpType = JumpType.MINI_APP;

	_serialize (): object
	{
		return {
			appid   : this.appid,
			pagepath: this.pagepath
		}
	}
}

export class UrlJumpAction extends JumpAction {
	constructor ( public url: string )
	{
		super ();
	}

	type: JumpType = JumpType.URL;

	_serialize (): object
	{
		return {
			url: this.url
		}
	}
}
