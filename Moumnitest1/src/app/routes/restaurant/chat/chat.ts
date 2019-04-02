export interface userlist {
    name:string;
    _id:number;
    avatar_url:string;
}


export interface chatData {
	sender:{
		name:string,
        id:string,
        email:string
	};
    receiver:{
        id:string,
        name:string,
        email:string
    };
    messages:any;
}

export interface showChat {
  data: string;
}
export interface userId {
  data: string;
}