/* GAIDI SHARED LAYOUT HELPERS */

function insertGAIDISocials(containerId){
    const box = document.getElementById(containerId);

    if(!box){
        return;
    }

    box.innerHTML = `
        <a href="#" target="_blank" rel="noopener noreferrer">
            <i class="fab fa-facebook-f"></i>
        </a>

        <a href="https://www.linkedin.com/company/global-all-integrated-development-initiative-gaidi/" target="_blank" rel="noopener noreferrer">
            <i class="fab fa-linkedin-in"></i>
        </a>

        <a href="https://wa.me/256779481284" target="_blank" rel="noopener noreferrer">
            <i class="fab fa-whatsapp"></i>
        </a>

        <a href="mailto:info@gaidiuganda.org">
            <i class="fas fa-envelope"></i>
        </a>
    `;
}

function showImpactArea(area){
    const output = document.getElementById("mapOutput");

    if(!output){
        return;
    }

    const data = {
        gulu:"Gulu City is GAIDI's current operational base and coordination centre.",
        lamwo:"Lamwo represents GAIDI's original community roots and future expansion interest.",
        acholi:"Acholi sub-region remains a priority area for inclusive development, health, livelihoods and disability inclusion.",
        uganda:"GAIDI's long-term vision is to contribute to inclusive and sustainable transformation across Uganda."
    };

    output.innerHTML = data[area] || "More information will be added soon.";
}

function calculateProgress(raised, goal){
    if(goal <= 0){
        return 0;
    }

    return Math.min(Math.round((raised / goal) * 100), 100);
}

function updateProgressBar(id, raised, goal){
    const bar = document.getElementById(id);

    if(!bar){
        return;
    }

    const percent = calculateProgress(raised, goal);
    bar.style.width = percent + "%";
    bar.innerHTML = percent + "%";
}