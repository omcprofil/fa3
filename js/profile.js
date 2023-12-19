const WIDTH = 962, HEIGHT = 250;
let scmSetup = 0, scm = 0, weinigSetup = 0, weinig = 0, prSetup = 0, pr = 0, purSetup = 0, pur = 0;
let qMillingSetup = 0, qFacingSetup = 0, qMilling = 0, qFacing = 0, qLastMilling = 0, qLastFacing = 0;
let planScm = 0, planWeinig = 0, planPr = 0, planPur = 0, planOdm4r = 0, planOdm3r = 0, plan4r = 0, plan3r = 0, plan2r = 0, planAll = 0;
let qLastWeek = 0, week = 0;

function chart(canvas, data) {
    const ctx = canvas.getContext('2d')
    canvas.style.width = WIDTH + 'px'
    canvas.style.height = HEIGHT + 'px'
    canvas.width = WIDTH
    canvas.height = HEIGHT
}

chart(document.getElementById('canvas'))

const HEAD = document.createElement('tr')
HEAD.innerHTML = `<th>Неделя</th> 
<th>N Партии</th> 
<th>Профиль</th> 
<th>Длина</th> 
<th>Цвет</th> 
<th>Количество</th> 
<th>Толщина МДФ</th> 
<th>Ширина полос</th>
<th>Полос с листа</th> 
<th>Кол-во листов</th> 
<th>Время Раскроя</th>  
<th>Фрезер. станок</th>
<th>Время Настр.Фрез.</th> 
<th>Время Фрезеровки</th>
<th>Ширина облицовки</th> 
<th>Время Резки</th>  
<th>Окут. станок</th> 
<th>Время Настр.Барб.</th> 
<th>Время облицовки</th>
<th>Время упак. CMB</th> 
<th>Время упак.карт.</th>`
document.querySelector('#ssheet').innerHTML = `<table id="plan"></table>`
document.querySelector('#plan').appendChild(HEAD)

fetch(
    "https://opensheet.elk.sh/1eMnc2hcwXYLe9A4SHCEBIg2N8E_GnenBNlfDFxMpJtQ/profile"
)
    .then((res) => res.json())
    .then((data) => {

        lastRow = data[data.length - 1];
        week = lastRow.week;

        data.forEach((row) => {

            let strip = +row.width + 2
            let rowSS = document.createElement('tr')
            rowSS.innerHTML = `<td>${row.week}</td>
            <td>${row.jobNo}</td>
             <td>${row.name}</td>
             <td>${row.length}</td>
             <td>${row.color}</td> 
             <td>${row.quantity}</td> 
             <td>${row.height}</td>
             <td>${+row.width + 3}</td>  
             <td>${row.stripInSheet}</td> 
             <td>${row.sheets}</td>
             <td>${row.cuttingT}</td>
             <td>${row.millingMashin}</td>
             <td>${row.mSTime}</td>
             <td>${row.millingT}</td>
             <td>${row.cladWidth}</td>
             <td>${row.cladCutT}</td>
             <td>${row.facingMashin}</td>
             <td>${row.fSTime}</td>
             <td>${row.facingT}</td>
             <td>${row.packingT}</td>
             <td>${row.pacBoxT}</td>`
            document.querySelector('#plan').appendChild(rowSS)


            if (row.millingMashin == "SCM") {
                scmSetup = scmSetup + +row.mSTime;
                scm = scm + +row.millingT;
            }
            else if (row.millingMashin == "WEINIG") {
                weinigSetup = weinigSetup + +row.mSTime;
                weinig = weinig + +row.millingT;
            }
            if (row.facingMashin == "PR-30") {
                prSetup = prSetup + +row.fSTime;
                pr = pr + +row.facingT;
            }
            else if (row.facingMashin == "PUR-33L") {
                purSetup = purSetup + +row.fSTime;
                pur = pur + +row.facingT;
            }
            if (row.mSTime > 0) qMillingSetup = qMillingSetup + 1;
            if (row.fSTime > 0) qFacingSetup = qFacingSetup + 1;
            if (row.week !== week) {
                qLastWeek = qLastWeek + +row.quantityM;
                if (row.millingMashin !== "completed" && row.millingMashin !== "no") qLastMilling = qLastMilling + +row.quantityM;
                if (row.facingMashin !== "completed" && row.facingMashin !== "no") qLastFacing = qLastFacing + +row.quantityM;
            }
            if (row.millingMashin !== "completed" && row.millingMashin !== "no") qMilling = qMilling + +row.quantityM;
            if (row.facingMashin !== "completed" && row.facingMashin !== "no") qFacing = qFacing + +row.quantityM;

        });

        planScm = (scm + scmSetup).toFixed(1);
        planWeinig = (weinig + weinigSetup).toFixed(1);
        planPr = (pr + prSetup).toFixed(1);
        planPur = (pur + purSetup).toFixed(1);
        plan4r = scmSetup + weinigSetup;
        planOdm4r = prSetup + purSetup;
        planOdm3r = (pr + pur).toFixed(1);
        plan3r = (scm + weinig + +lastRow.cuttingT + +lastRow.cladCutT + prSetup + pr + purSetup + pur + +lastRow.packingT + +lastRow.pacBoxT * 2).toFixed(1);
        plan2r = (scm + weinig + +lastRow.cuttingT + pr + pur + +lastRow.packingT).toFixed(1);
        planAll = (plan4r + +plan3r + +plan2r + planOdm4r * 2 + +planOdm3r).toFixed(1);

        document.querySelector('#plantxt').innerHTML = `
        <h4> Цех №1 Участок №1 (Погонаж) ${week} к.н.</h4>
        <p>Плановый объем - <b>${lastRow.quantityM} м.п.</b> ${lastRow.quantity} шт. на фрезеровку - <b>${qMilling.toFixed(1)} м.п.</b> на облицовку - <b>${qFacing.toFixed(1)} м.п.</b> </p>
        <p style="background:#d9d9d9">в том числе - <b>${qLastWeek.toFixed(1)} м.п. </b> с прошлой недели, на фрезеровку - <b>${qLastMilling.toFixed(1)} м.п. </b> на облицовку - <b>${qLastFacing.toFixed(1)} м.п.</b>.</p>
        <p>Количнство настроек фрезера - <b>${qMillingSetup - 1}</b>, количество настроек барберана - <b>${qFacingSetup - 1}</b>.</p>
        <p style="background:#c9daf8">Плановое время раскроя <b>HOLZMA OPT HPP 350 = ${lastRow.cuttingT} ч.</b> (СДОС 3р. + 2р.)</p>
        <p style="background:#93c47d">Плановое время настройки <b>SMC Superset XL = ${scmSetup} ч.</b> (СДОС 4р.)</p>
        <p style="background:#d9ead3">Плановое время работы <b>SCM Superset XL = ${scm.toFixed(1)} ч.</b> (СДОС 3р. + 2р.)</p>
        <p style="background:#93c47d">Плановое время настройки <b>WEINIG Powermat 1200 = ${weinigSetup} ч.</b> (СДОС 4р.)</p>
        <p style="background:#d9ead3">Плановое время работы <b>WEINIG Powermat 1200 = ${weinig.toFixed(1)} ч.</b> (СДОС 3р. + 2р.)</p>
        <p>Плановое время резки <b>Barberan BALCO TF - 1300 = ${lastRow.cladCutT} ч.</b> (СДОС 3р.)</p>
        <p style="background:#ffd966">Плановое время настройки <b>Barberan PR - 30 = ${prSetup} ч.</b> (ОДМ 4р. + СДОС 3р.)</p>
        <p style="background:#fef1cb">Плановое время работы <b>Barberan PR - 30 = ${pr.toFixed(1)} ч.</b> (ОДМ 3р. + СДОС 3р. + 2р.)</p>
        <p style="background:#ffd966">Плановое время настройки <b>Barberan PUR - 33L = ${purSetup} ч.</b> (ОДМ 4р. + СДОС 3р.)</p>
        <p style="background:#fef1cb">Плановое время работы <b>Barberan PUR - 33L = ${pur.toFixed(1)} ч.</b> (ОДМ 3р. + СДОС 3р. + 2р.)</p>
        <p style="background:#e6b8af">Плановое время упаковки <b>CMB ERL - 30 - EXP = ${lastRow.packingT} ч.</b> (СДОС 3р. + 2р.)</p>
        <p style="background:#fce1e1">Плановое время упаковки <b>в картон = ${lastRow.pacBoxT} ч.</b> (СДОС 3р. + 2р.)</p>
        <p style="background:#93c47d">Итого плановая загрузка <b>SCM Superset XL = ${planScm} ч.</b></p>
        <p style="background:#d9ead3">Итого плановая загрузка <b>WEINIG Powermat 1200 = ${planWeinig} ч.</b></p>
        <p style="background:#ffd966">Итого плановая загрузка <b>Barberan PR - 30 = ${planPr} ч.</b></p>
        <p style="background:#fef1cb">Итого плановая загрузка <b>Barberan PUR - 33L = ${planPur} ч.</b></p>
        <p>Итого плановые трудозатраты СДОС-4р. - <b>${plan4r} ч.,</b> 3р. - <b>${plan3r} ч.,</b> 2р. - <b>${plan2r} ч.,</b> ОДМ-4р. - <b>${planOdm4r} ч.,</b> 3р. - <b>${planOdm3r} ч.,</b> Итого: <b>${planAll} ч.,</b></p>
        <p><span class="bluetext">Раскрой</span> <span class="greentext">Фрезеровка</span> <span class="yellowtext">Облицовка</span> <span class="redtext">Упаковка</span></p>`;

    });