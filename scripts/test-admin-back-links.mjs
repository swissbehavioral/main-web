import {createServer} from 'vite';
const server=await createServer({configFile:false,server:{middlewareMode:true,watch:null,ws:false},appType:'custom'});
try{const test=await server.ssrLoadModule('/scripts/admin-navigation-check.tsx');test.checkAdminNavigation();}finally{await server.close();}
