const {verify,db}=require('./_maelle-admin');
module.exports=async(req,res)=>{
 res.setHeader('Cache-Control','no-store');
 try {
  if(req.method==='GET'){
   const r=await db('maelle_promocoes?chave=eq.black_friday&select=ativa');
   if(!r.ok)throw Error('Configuração Black Friday indisponível. Execute o SQL.');
   const rows=await r.json();return res.status(200).json({active:rows[0]?.ativa===true,percent:20});
  }
  if(req.method!=='POST')return res.status(405).json({error:'Método não permitido.'});
  if(!(await verify(req)))return res.status(403).json({error:'Sem permissão de administrador.'});
  if(typeof req.body?.active!=='boolean')return res.status(400).json({error:'Estado inválido.'});
  const r=await db('maelle_promocoes?chave=eq.black_friday',{method:'PATCH',headers:{Prefer:'return=representation'},body:JSON.stringify({ativa:req.body.active,atualizado_em:new Date().toISOString()})});
  if(!r.ok)throw Error('Não foi possível guardar a campanha.');
  const rows=await r.json();if(rows.length!==1)throw Error('Campanha não encontrada. Execute o SQL.');
  return res.status(200).json({active:rows[0].ativa,percent:20});
 }catch(e){console.error('Black Friday:',e.message);return res.status(503).json({error:e.message});}
};
