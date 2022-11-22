import { noticePost } from './notice.js';

const hashTags = ['news', 'newRace', 'training'];

export async function readChannelPosts(ctx, post) {
	try {
		let text = '';
		if (post.text) text = post.text;
		if (post.caption) text = post.caption;

		const message = `https://t.me/${post.sender_chat.username}/${post.message_id}`;
		hashTags.forEach(async hashTag => {
			if (text.includes(`#${hashTag}`))
				await noticePost(ctx, hashTag, message).catch(e => console.log(e));
		});
	} catch (error) {
		console.log(error);
	}
}
