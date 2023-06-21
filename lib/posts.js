import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const postsDir = path.join(process.cwd(),'posts');

export function getSortedPostsData(){
    const fileNames = fs.readdirSync(postsDir);
    const allPostsData=fileNames.map((fileName)=>{
        const id = fileName.replace(/\.md$/,'');
        const fullPath = path.join(postsDir,fileName);
        const contents = fs.readFileSync(fullPath,'utf8');
        const matterResult = matter(contents);
        return{
            id,
            ...matterResult.data,
        };
    });

    return allPostsData.sort((a,b)=>{
        if (a.date <b.date){
            return 1;
        } else {
            return -1;
        }
    });
}

export function getAllPostIds(){
    const fileNames = fs.readdirSync(postsDir);
    return fileNames.map((fileName)=>{
        return {
            params: {
                id: fileName.replace(/\.md$/,''),
            },
        };
    });
}

export async function PostData(id){
    const fullPath=path.join(postsDir,`${id}.md`);
    const fcon = fs.readFileSync(fullPath,'utf8');
    const matterResult = matter(fcon);
    const processedContent = await remark().use(html).process(matterResult.content);
    const htmlContent = processedContent.toString();
    return {
        id,
        htmlContent,
        ...matterResult.data,
    }
}