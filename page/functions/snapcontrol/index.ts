import SnapControl from "types/snapcontrol/SnapControl";

// let snapcontrol!: SnapControl;
// let snapstream: SnapStream | null = null;
// let hide_offline: boolean = true;
// let autoplay_done: boolean = false;
// let audio: HTMLAudioElement = document.createElement('audio');

function autoplayRequested(): boolean {
    return document.location.hash.match(/autoplay/) !== null;
}

function show(snapcontrol: SnapControl, hide_offline?: boolean, snapstream?: SnapStream, onAutoplayTriggered?: () => void) {
    // Render the page
    const versionElem = document.getElementsByTagName("meta").namedItem("version");
    console.log("Snapweb version " + (versionElem ? versionElem.content : "null"));

    let play_img: string;
    if (snapstream) {
        play_img = 'stop.png';
    } else {
        play_img = 'play.png';
    }

    let content = "";
    content += "<div class='navbar'>Snapcast";
    let serverVersion = snapcontrol.server.server.snapserver.version.split('.');
    if ((serverVersion.length >= 2) && (+serverVersion[1] >= 21)) {
        content += "    <img src='" + play_img + "' class='play-button' id='play-button'></a>";
        // Stream became ready and was not playing. If autoplay is requested, start playing.
        if (!snapstream && onAutoplayTriggered && autoplayRequested()) {
            play();
            onAutoplayTriggered()

        }
    }
    content += "</div>";
    content += "<div class='content'>";

    let server = snapcontrol.server;
    for (let group of server.groups) {
        if (hide_offline) {
            let groupActive = false;
            for (let client of group.clients) {
                if (client.connected) {
                    groupActive = true;
                    break;
                }
            }
            if (!groupActive)
                continue;
        }

        // Set mute variables
        let classgroup;
        let muted: boolean;
        let mute_img: string;
        if (group.muted == true) {
            classgroup = 'group muted';
            muted = true;
            mute_img = 'mute_icon.png';
        } else {
            classgroup = 'group';
            muted = false;
            mute_img = 'speaker_icon.png';
        }

        // Start group div
        content += "<div id='g_" + group.id + "' class='" + classgroup + "'>";

        // Create stream selection dropdown
        let streamselect = "<select id='stream_" + group.id + "' onchange='setStream(\"" + group.id + "\")' class='stream'>"
        for (let i_stream = 0; i_stream < server.streams.length; i_stream++) {
            let streamselected = "";
            if (group.stream_id == server.streams[i_stream].id) {
                streamselected = 'selected'
            }
            streamselect += "<option value='" + server.streams[i_stream].id + "' " + streamselected + ">" + server.streams[i_stream].id + ": " + server.streams[i_stream].status + "</option>";
        }

        streamselect += "</select>";

        // Group mute and refresh button
        content += "<div class='groupheader'>";
        content += streamselect;
        // let cover_img: string = server.getStream(group.stream_id)!.properties.metadata.artUrl || "snapcast-512.png";
        // content += "<img src='" + cover_img + "' class='cover-img' id='cover_" + group.id + "'>";
        let clientCount = 0;
        for (let client of group.clients)
            if (!hide_offline || client.connected)
                clientCount++;
        if (clientCount > 1) {
            let volume = snapcontrol.getGroupVolume(group, hide_offline);
            // content += "<div class='client'>";
            content += "<a href=\"javascript:setMuteGroup('" + group.id + "'," + !muted + ");\"><img src='" + mute_img + "' class='mute-button'></a>";
            content += "<div class='slidergroupdiv'>";
            content += "    <input type='range' draggable='false' min=0 max=100 step=1 id='vol_" + group.id + "' oninput='javascript:setGroupVolume(\"" + group.id + "\")' value=" + volume + " class='slider'>";
            // content += "    <input type='range' min=0 max=100 step=1 id='vol_" + group.id + "' oninput='javascript:setVolume(\"" + client.id + "\"," + client.config.volume.muted + ")' value=" + client.config.volume.percent + " class='" + sliderclass + "'>";
            content += "</div>";
            // content += "</div>";
        }
        // transparent placeholder edit icon
        content += "<div class='edit-group-icon'>&#9998</div>";
        content += "</div>";
        content += "<hr class='groupheader-separator'>";

        // Create clients in group
        for (let client of group.clients) {
            if (!client.connected && hide_offline)
                continue;
            // Set name and connection state vars, start client div
            let name;
            let clas = 'client'
            if (client.config.name != "") {
                name = client.config.name;
            } else {
                name = client.host.name;
            }
            if (client.connected == false) {
                clas = 'client disconnected';
            }
            content += "<div id='c_" + client.id + "' class='" + clas + "'>";

            // Client mute status vars
            let muted: boolean;
            let mute_img: string;
            let sliderclass;
            if (client.config.volume.muted == true) {
                muted = true;
                sliderclass = 'slider muted';
                mute_img = 'mute_icon.png';
            } else {
                sliderclass = 'slider'
                muted = false;
                mute_img = 'speaker_icon.png';
            }

            // Populate client div
            content += "<a href=\"javascript:setVolume('" + client.id + "'," + !muted + ");\"><img src='" + mute_img + "' class='mute-button'></a>";
            content += "    <div class='sliderdiv'>";
            content += "        <input type='range' min=0 max=100 step=1 id='vol_" + client.id + "' oninput='javascript:setVolume(\"" + client.id + "\"," + client.config.volume.muted + ")' value=" + client.config.volume.percent + " class='" + sliderclass + "'>";
            content += "    </div>";
            content += "    <span class='edit-icons'>";
            content += "        <a href=\"javascript:openClientSettings('" + client.id + "');\" class='edit-icon'>&#9998</a>";
            if (client.connected == false) {
                content += "      <a href=\"javascript:deleteClient('" + client.id + "');\" class='delete-icon'>&#128465</a>";
                content += "   </span>";
            } else {
                content += "</span>";
            }
            content += "    <div class='name'>" + name + "</div>";
            content += "</div>";
        }
        content += "</div>";
    }
    content += "</div>"; // content

    content += "<div id='client-settings' class='client-settings'>";
    content += "    <div class='client-setting-content'>";
    content += "        <form action='javascript:closeClientSettings()'>";
    content += "        <label for='client-name'>Name</label>";
    content += "        <input type='text' class='client-input' id='client-name' name='client-name' placeholder='Client name..'>";
    content += "        <label for='client-latency'>Latency</label>";
    content += "        <input type='number' class='client-input' min='-10000' max='10000' id='client-latency' name='client-latency' placeholder='Latency in ms..'>";
    content += "        <label for='client-group'>Group</label>";
    content += "        <select id='client-group' class='client-input' name='client-group'>";
    content += "        </select>";
    content += "        <input type='submit' value='Submit'>";
    content += "        </form>";
    content += "    </div>";
    content += "</div>";

    // Pad then update page
    content = content + "<br><br>";
    (document.getElementById('show') as HTMLInputElement).innerHTML = content;
    let playElem = (document.getElementById('play-button') as HTMLElement);
    playElem.onclick = () => {
        play();
    };

    for (let group of snapcontrol.server.groups) {
        if (group.clients.length > 1) {
            let slider = document.getElementById("vol_" + group.id) as HTMLInputElement;
            if (slider == null)
                continue;

            // TODO:DARE replace these groupVolumeEnter functions
            slider.addEventListener('pointerdown', function () {
                // groupVolumeEnter(group.id);
            });
            slider.addEventListener('touchstart', function () {
                // groupVolumeEnter(group.id);
            });
        }
    }
}

function setVolume(id: string, mute: boolean) {
    console.log("setVolume id: " + id + ", mute: " + mute);
    let percent = (document.getElementById('vol_' + id) as HTMLInputElement).valueAsNumber;
    let client = snapcontrol.getClient(id);
    let needs_update = (mute != client.config.volume.muted);
    snapcontrol.setVolume(id, percent, mute);
    let group = snapcontrol.getGroupFromClient(id);
    updateGroupVolume(group);
    if (needs_update)
        show();
}

function play() {
    if (snapstream) {
        snapstream.stop();
        snapstream = null;
        audio.pause();
        audio.src = '';
        document.body.removeChild(audio);
    }
    else {
        snapstream = new SnapStream(config.baseUrl);
        // User interacted with the page. Let's play audio...
        document.body.appendChild(audio);
        audio.src = "10-seconds-of-silence.mp3";
        audio.loop = true;
        audio.play().then(() => {
            snapcontrol.updateProperties(snapcontrol.getMyStreamId());
        });
    }
}

function setMuteGroup(id: string, mute: boolean) {
    snapcontrol.muteGroup(id, mute);
    show();
}

function setStream(id: string) {
    snapcontrol.setStream(id, (document.getElementById('stream_' + id) as HTMLInputElement).value);
    show();
}

function setGroup(client_id: string, group_id: string) {
    console.log("setGroup id: " + client_id + ", group: " + group_id);

    let server = snapcontrol.server;
    // Get client group id
    let current_group = snapcontrol.getGroupFromClient(client_id);

    // Get
    //   List of target group's clients
    // OR
    //   List of current group's other clients
    let send_clients = [];
    for (let i_group = 0; i_group < server.groups.length; i_group++) {
        if (server.groups[i_group].id == group_id || (group_id == "new" && server.groups[i_group].id == current_group.id)) {
            for (let i_client = 0; i_client < server.groups[i_group].clients.length; i_client++) {
                if (group_id == "new" && server.groups[i_group].clients[i_client].id == client_id) { }
                else {
                    send_clients[send_clients.length] = server.groups[i_group].clients[i_client].id;
                }
            }
        }
    }

    if (group_id == "new")
        group_id = current_group.id;
    else
        send_clients[send_clients.length] = client_id;
    snapcontrol.setClients(group_id, send_clients);
}

function setName(id: string) {
    // Get current name and lacency
    let client = snapcontrol.getClient(id);
    let current_name: string = (client.config.name != "") ? client.config.name : client.host.name;
    let current_latency: number = client.config.latency;

    let new_name = window.prompt("New Name", current_name);
    let new_latency = Number(window.prompt("New Latency", String(current_latency)));

    if (new_name != null)
        snapcontrol.setClientName(id, new_name);
    if (new_latency != null)
        snapcontrol.setClientLatency(id, new_latency);
    show()
}


function openClientSettings(id: string) {
    let modal = document.getElementById("client-settings") as HTMLElement;
    let client = snapcontrol.getClient(id);
    let current_name: string = (client.config.name != "") ? client.config.name : client.host.name;
    let name = document.getElementById("client-name") as HTMLInputElement;
    name.name = id;
    name.value = current_name;
    let latency = document.getElementById("client-latency") as HTMLInputElement;
    latency.valueAsNumber = client.config.latency;

    let group = snapcontrol.getGroupFromClient(id);
    let group_input = document.getElementById("client-group") as HTMLSelectElement;
    while (group_input.length > 0)
        group_input.remove(0);
    let group_num = 0;
    for (let ogroup of snapcontrol.server.groups) {
        let option = document.createElement('option');
        option.value = ogroup.id;
        option.text = "Group " + (group_num + 1) + " (" + ogroup.clients.length + " Clients)";
        group_input.add(option);
        if (ogroup == group) {
            console.log("Selected: " + group_num);
            group_input.selectedIndex = group_num;
        }
        ++group_num;
    }
    let option = document.createElement('option');
    option.value = option.text = "new";
    group_input.add(option);

    modal.style.display = "block";
}

function closeClientSettings() {
    let name = document.getElementById("client-name") as HTMLInputElement;
    let id = name.name;
    console.log("onclose " + id + ", value: " + name.value);
    snapcontrol.setClientName(id, name.value);

    let latency = document.getElementById("client-latency") as HTMLInputElement;
    snapcontrol.setClientLatency(id, latency.valueAsNumber);

    let group_input = document.getElementById("client-group") as HTMLSelectElement;
    let option = group_input.options[group_input.selectedIndex];
    setGroup(id, option.value);

    let modal = document.getElementById("client-settings") as HTMLElement;
    modal.style.display = "none";
    show();
}

function deleteClient(id: string) {
    if (confirm('Are you sure?')) {
        snapcontrol.deleteClient(id);
    }
}