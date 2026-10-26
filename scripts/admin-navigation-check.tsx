import assert from 'node:assert/strict';
import {renderToStaticMarkup} from 'react-dom/server';
import {createMemoryRouter,RouterProvider} from 'react-router';
import AdminLayout from '../app/routes/admin';
export function checkAdminNavigation(){
 const fixture:any={identity:{id:'local-qa',name:'Local QA',email:'qa@example.test',role:'admin'},health:{reachable:true},provider:'file'};
 for(const [path,kind,expected] of [
  ['/admin/staff','page','/admin'],
  ['/admin/content/page-home','page','/admin/content'],
  ['/admin/content/post-one','post','/admin/content?view=blog'],
  ['/admin/content/page-home/preview','page','/admin/content/page-home'],
  ['/admin/chat?id=one&status=closed','page','/admin/chat?status=closed'],
  ['/admin/leads/one','page','/admin'],
 ]){
  const router=createMemoryRouter([{id:'admin',path:'/admin',element:<AdminLayout loaderData={fixture} {...({} as any)}/>,children:[{id:'selected-section',path:'*',loader:()=>null,element:<p>Local fixture</p>}]}],{initialEntries:[path],hydrationData:{loaderData:{'selected-section':{record:{kind}}}}});
  const html=renderToStaticMarkup(<RouterProvider router={router}/>);
  assert.equal(html.match(/class="admin-context-back"[^>]*href="([^"]+)"/)?.[1],expected,path);
 }
 console.log('PASS: actual admin shell renders contextual back links for staff, page/blog editors, preview, filtered conversation and lead detail. No authentication or remote requests.');
}
