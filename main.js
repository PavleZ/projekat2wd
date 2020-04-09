window.onload=function(){
    $.ajax({
        url:"artikli.json",
        method:"get",
        dataType:"json",
        success:function(data){
            console.log(data);
            localStorage.setItem("svi",JSON.stringify(data));
            

        },
        error:function(xhr,status,err){
            console.log(err);
        }
    })
    localStorage.removeItem("artikli")
    localStorage.removeItem("izabrani")

    document.getElementById("dodaj").addEventListener("click",dodajUkorpu)
    izracunajUkupnuCenu();
    document.getElementById("posalji").addEventListener("click",posaljiBeku);
}
let brojac=0;
function dodajUkorpu(){
    $(".kolicina,#artikli").stop(true,true);
    let divIspis=document.getElementById("itemi");
    let html="";
    html+=`<tr>
        <td><div class="form-group"><select form="forma"class="form-control artikli" >
        ${popuniDDL()}</select></div></td>
        <td><div class="form-group"><input  form="forma" class="form-control kolicina"type="text"id="kol" placeholder="Unesite kolicinu"/></div></td>
        <td><label form="forma" class="cena"></label></td>
        <td><a href="#" class="btn btn-primary izbaci">Izbaci</a></td>

        
    </tr>`;
    divIspis.innerHTML+=html;
    $(`.artikli`).change(dohvatiArtikl)
    $(`.kolicina`).blur(dajKolicinu)
    $(".izbaci").click(obrisi)


}

function dohvatiArtikl(){
    let id=$(this).val()
    ubaciIzabrane(id);
    //upisati u kolicinu id elementa koji je izabran kao data
    $(this).parents("td").next("td").find(".kolicina").attr("data-aid",id);
   ;
   $(this).parents("td").next("td").next("td").next("td").find(".izbaci").attr("data-aid",id);
   ;
}


function dajKolicinu(){
    console.log($(this).parents("td").next("td").find(".cena")[0])
   let kolicina=$(this).val();
   let idArtikla=this.dataset.aid;
   if(kolicina<=0)
   alert("Kolicina ne moze biti manja ili jednaka nuli");
   else{
   (kolicina<=10)?izracunajCenu(kolicina,dajCenu(idArtikla,1),$(this).parents("td").next("td").find(".cena")[0]):izracunajCenu(kolicina,dajCenu(idArtikla,2),$(this).parents("td").next("td").find(".cena")[0])
   }
   
   
//ubacivanje izabranog artikla u LS
   let cena=$(this).parents("td").next("td").find(".cena")[0].innerHTML;
   let tmp={id:Number(idArtikla),kolicina:Number(kolicina),cena:Number(cena)}
       console.log(tmp);
       
   if(!localStorage.getItem("artikli")){
    let tmpA=[];
    tmpA.push(tmp);
       localStorage.setItem("artikli",JSON.stringify(tmpA));
   }
   else{
        let itemi=JSON.parse(localStorage.getItem("artikli"))
        itemi.push(tmp);
       localStorage.setItem("artikli",JSON.stringify(itemi));

   }
   izracunajUkupnuCenu();
   

}
function ubaciIzabrane(id){
    let artikli=[];
    
    if(!localStorage.getItem("izabrani")){
       
        artikli.push(Number(id));
       
    }else{
       artikli= JSON.parse(localStorage.getItem("izabrani"));
       console.log(artikli);
       artikli.push(Number(id))
    }
    localStorage.setItem("izabrani",JSON.stringify(artikli))
    

}
function popuniDDL(){
    let svi=JSON.parse(localStorage.getItem("svi"));
    let izabrani=JSON.parse(localStorage.getItem("izabrani"))
    console.log(izabrani)
    let html=`<option value="0">Izaberite artikl</option>`;
    if(!JSON.parse(localStorage.getItem("izabrani"))){
        svi.forEach(e=>{
            html+=`<option value="${e.id}">${e.ime}</option>`;
        })
    }
    else{
        svi.forEach(e=>{
            if(!izabrani.includes(e.id))
            html+=`<option value="${e.id}">${e.ime}</option>`;
        })
    }
    
    
    return html;
}

function dajCenu(id,tip){
   let svi=JSON.parse(localStorage.getItem("svi"));
   let cena;
    if(tip==1){
        let obj=svi.filter(e=>e.id==id)
        console.log(obj[0].cena1);
        cena=obj[0].cena1;
    }
    else{
        let obj=svi.filter(e=>e.id==id)
        console.log(obj[0].cena2);

        cena=obj[0].cena2;

    }
    return cena;  
}
function izracunajCenu(kolicina,cena,ispis){  
    ispis.innerHTML=kolicina*cena;
}
function obrisi(){
    obrisiIzLS(this.dataset.aid)
    $(this).parents("tr").remove();
}
function obrisiIzLS(id){
    let itemi=JSON.parse(localStorage.getItem("artikli"));
    console.log(itemi);
    let novi=itemi.filter(i=>i.id !=id);
  
  localStorage.setItem("artikli",JSON.stringify(novi))
  izracunajUkupnuCenu()

}
function izracunajUkupnuCenu(){
    let divIspis=document.getElementById("UkupnaCena");
    let itemi=JSON.parse(localStorage.getItem("artikli"));
    if(!localStorage.getItem("artikli") || itemi.length==0){
        divIspis.innerHTML=`<h3 >Korpa je prazna</h3>`;
    }
   
    else{
        let price=0;
        itemi.forEach(el=>{
            price+=el.cena;
        })
        divIspis.innerHTML="Ukupna cena iznosi: "+price;

    }
}
function posaljiBeku(){
    let itemi=JSON.parse(localStorage.getItem("artikli"));
    if(!localStorage.getItem("artikli") || itemi.length==0){
        alert("Morate da ubacite neke artikle u korpu da biste ih poslali!");
    }
    else{
      $.ajax({
          url:"obrada.php",
          method:"post",
          dataType:"json",
          data:{
              artikli:itemi
          },
          success:function(poruka){
              alert(poruka);
          },
          error:function(err){
              console.log(err)
          }
          
      })
      console.log(itemi);
    }
}