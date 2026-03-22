// --- Settings & Persistence ---

// Default creds and profile
let creds = JSON.parse(localStorage.getItem('fazz_creds')) || { user: 'admin', pass: 'admin123' };

let defaultProfile = {
    name: "Admin User",
    email: "admin@fazztech.lk",
    phone: "+94 77 123 4567",
    userAvatarBase64: null, // null means use feather icon
    compName: "FAZZ TECHNOLOGY (PVT) LTD",
    compSub: "(Dealers in All kind of Laptop & Desktop Accessories)",
    compAddr: "No.39/1/11, Fortune Arcade,, Galle Road,Colombo 04",
    compContact: "Tel: 0777 960 600 | 0773 270 433 | web: www.fazztech.lk email: info@fazztech.lk",
    compFooter: 'All cheques should be drawn in favour of "FAZZ TECHNOLOGY (PVT) LTD"',
    logoBase64: null // null means use default SVG
};

let profile = JSON.parse(localStorage.getItem('fazz_profile')) || defaultProfile;

function checkAuth() {
    let loginScreen = document.getElementById('loginScreen');
    let mainApp = document.getElementById('mainApp');
    let authBox = document.querySelector('.auth-box');

    // Clean up classes
    authBox.classList.remove('animate-out', 'shake');
    mainApp.classList.remove('animate-in', 'opacity-0');

    if (sessionStorage.getItem('fazz_auth') === 'true') {
        loginScreen.style.display = 'none';
        mainApp.style.display = 'flex';
        applyProfileToApp();
        renderItems(); 
        adjustScale();
    } else {
        loginScreen.style.display = 'flex';
        mainApp.style.display = 'none';
        
        // Listeners for 'Enter' key on login
        document.getElementById('loginPass').addEventListener('keypress', function(e) {
            if(e.key === 'Enter') attemptLogin();
        });
    }
}

function attemptLogin() {
    let u = document.getElementById('loginUser').value;
    let p = document.getElementById('loginPass').value;
    let btn = document.querySelector('#loginScreen .btn-print');
    let authBox = document.querySelector('.auth-box');
    
    // Add loading spinner class
    btn.classList.add('btn-loading');
    authBox.classList.remove('shake');
    document.getElementById('loginError').textContent = '';

    setTimeout(() => {
        btn.classList.remove('btn-loading');

        if (u === creds.user && p === creds.pass) {
            // Success Auth - Trigger Animation Sequence
            sessionStorage.setItem('fazz_auth', 'true');
            authBox.classList.add('animate-out');
            
            setTimeout(() => {
                document.getElementById('loginScreen').style.display = 'none';
                let mainApp = document.getElementById('mainApp');
                mainApp.style.display = 'flex';
                mainApp.classList.add('animate-in'); // Trigger slide up fade in
                
                applyProfileToApp();
                renderItems(); 
                adjustScale();
            }, 550); // wait for fadeOutUp to finish
            
        } else {
            // Fail Auth
            document.getElementById('loginError').textContent = 'Invalid username or password';
            authBox.classList.add('shake');
        }
    }, 800); // fake network delay 800ms
}

function logout() {
    let mainApp = document.getElementById('mainApp');
    mainApp.classList.remove('animate-in');
    mainApp.classList.add('animate-out');

    setTimeout(() => {
        sessionStorage.removeItem('fazz_auth');
        document.getElementById('loginUser').value = '';
        document.getElementById('loginPass').value = '';
        checkAuth();
    }, 550);
}

let profileBtn = document.getElementById('mainProfileBtn');
if (profileBtn) {
    profileBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        document.getElementById("settingsMenu").classList.toggle("show");
    });
}

function toggleMenu() {
    document.getElementById("settingsMenu").classList.toggle("show");
}

window.onclick = function(event) {
    if (!event.target.closest('.dropdown')) {
        let dropdowns = document.getElementsByClassName("dropdown-content");
        for (let i = 0; i < dropdowns.length; i++) {
            let openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) openDropdown.classList.remove('show');
        }
    }
}

// --- Profile Settings Modal ---
function openProfileModal() {
    document.getElementById('profileModal').style.display = "block";
    document.getElementById('profError').textContent = '';
    
    // Populate User Details
    document.getElementById('profName').value = profile.name || "";
    document.getElementById('profEmail').value = profile.email || "";
    document.getElementById('profPhone').value = profile.phone || "";
    
    // Clear Password Fields
    document.getElementById('profCurPwd').value = '';
    document.getElementById('profNewPwd').value = '';
    document.getElementById('profConPwd').value = '';
    
    // Populate Company Details
    document.getElementById('profCompName').value = profile.compName;
    document.getElementById('profCompSub').value = profile.compSub;
    document.getElementById('profCompAddr').value = profile.compAddr;
    document.getElementById('profCompContact').value = profile.compContact;
    
    // Handle User Avatar preview inside modal
    let uPreviewImg = document.getElementById('userAvatarPreviewImg');
    if (profile.userAvatarBase64) {
        uPreviewImg.src = profile.userAvatarBase64;
        uPreviewImg.style.display = 'block';
    } else {
        uPreviewImg.src = '';
        uPreviewImg.style.display = 'none';
    }

    // Handle Company Logo preview inside modal
    let previewBox = document.getElementById('avatarPreviewBox');
    let previewImg = document.getElementById('avatarPreviewImg');
    if (profile.logoBase64) {
        previewImg.src = profile.logoBase64;
        previewImg.style.display = 'block';
    } else {
        previewImg.src = '';
        previewImg.style.display = 'none';
    }
}

// Wait to track if they chose a new photo before saving
let tempLogoBase64 = null;
let tempUserAvatarBase64 = null;

function handleUserAvatarUpload(event) {
    let file = event.target.files[0];
    if (file) {
        let reader = new FileReader();
        reader.onload = function(e) {
            tempUserAvatarBase64 = e.target.result;
            let previewImg = document.getElementById('userAvatarPreviewImg');
            previewImg.src = tempUserAvatarBase64;
            previewImg.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
}

function removeUserAvatar() {
    tempUserAvatarBase64 = "REMOVED";
    document.getElementById('userAvatarPreviewImg').src = '';
    document.getElementById('userAvatarPreviewImg').style.display = 'none';
    document.getElementById('profUserAvatarUpload').value = '';
}

function handleLogoUpload(event) {
    let file = event.target.files[0];
    if (file) {
        let reader = new FileReader();
        reader.onload = function(e) {
            tempLogoBase64 = e.target.result;
            let previewImg = document.getElementById('avatarPreviewImg');
            previewImg.src = tempLogoBase64;
            previewImg.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
}

function removeLogo() {
    tempLogoBase64 = "REMOVED";
    document.getElementById('avatarPreviewImg').src = '';
    document.getElementById('avatarPreviewImg').style.display = 'none';
    document.getElementById('profLogoUpload').value = '';
}

function saveProfile() {
    let err = document.getElementById('profError');
    err.style.color = "var(--danger)";
    
    // Grab all field inputs
    let pn = document.getElementById('profName').value.trim();
    let pe = document.getElementById('profEmail').value.trim();
    let pp = document.getElementById('profPhone').value.trim();
    
    let cn = document.getElementById('profCompName').value.trim();
    let cs = document.getElementById('profCompSub').value.trim();
    let ca = document.getElementById('profCompAddr').value.trim();
    let cc = document.getElementById('profCompContact').value.trim();
    
    let curPwd = document.getElementById('profCurPwd').value;
    let newPwd = document.getElementById('profNewPwd').value;
    let conPwd = document.getElementById('profConPwd').value;
    
    // Validate Password change IF new password is provided
    if (newPwd.length > 0) {
        if (curPwd !== creds.pass) {
            err.textContent = "Current password incorrect. Cannot change password.";
            return;
        }
        if (newPwd !== conPwd) {
            err.textContent = "New passwords do not match.";
            return;
        }
        // Save new password
        creds.pass = newPwd;
        localStorage.setItem('fazz_creds', JSON.stringify(creds));
    }
    
    // Save Profile Information
    profile.name = pn || "Admin User";
    profile.email = pe || "admin@fazztech.lk";
    profile.phone = pp || "";
    
    profile.compName = cn;
    profile.compSub = cs;
    profile.compAddr = ca;
    profile.compContact = cc;
    // Auto generate footer based on Company Name
    profile.compFooter = `All cheques should be drawn in favour of "${cn}"`;
    
    if (tempLogoBase64 === "REMOVED") profile.logoBase64 = null;
    else if (tempLogoBase64) profile.logoBase64 = tempLogoBase64;
    
    if (tempUserAvatarBase64 === "REMOVED") profile.userAvatarBase64 = null;
    else if (tempUserAvatarBase64) profile.userAvatarBase64 = tempUserAvatarBase64;
    
    localStorage.setItem('fazz_profile', JSON.stringify(profile));
    
    tempLogoBase64 = null; // reset temp
    tempUserAvatarBase64 = null;
    
    err.style.color = "var(--success)";
    err.textContent = "Profile Settings Saved Successfully!";
    
    // Apply changes visually immediately
    applyProfileToApp();
    
    setTimeout(() => { closeModal('profileModal'); }, 1000);
}

// This function pushes profile object variables to HTML
function applyProfileToApp() {
    // Top Right Corner Menu Labels
    document.getElementById('loggedUserName').textContent = profile.name;
    document.getElementById('loggedUserEmail').textContent = profile.email + (profile.phone ? ` • ${profile.phone}` : "");
    
    // Avatar Circle Graphic
    let avatarCircle = document.querySelector('.avatar-circle');
    if (profile.userAvatarBase64) {
        avatarCircle.innerHTML = `<img src="${profile.userAvatarBase64}" style="width:100%; height:100%; border-radius:50%; object-fit:cover;">`;
    } else {
        avatarCircle.innerHTML = `<i data-feather="user" style="width:16px; color:#fff;"></i>`;
        if (window.feather) feather.replace();
    }
    
    // Invoice Company Headers
    document.getElementById('renderCompanyName').textContent = profile.compName;
    document.getElementById('renderCompanyDesc').textContent = profile.compSub;
    document.getElementById('renderCompanyAddr').textContent = profile.compAddr;
    document.getElementById('renderCompanyContact').textContent = profile.compContact;
    document.getElementById('renderCompanyFooter').textContent = profile.compFooter;
    
    // If Logo Base64 exists, replace logo block, else show SVG
    let logoBox = document.getElementById('renderLogoContainer');
    if (profile.logoBase64) {
        logoBox.innerHTML = `<img src="${profile.logoBase64}" style="max-height: 80px; width: auto; display: block;">`;
    } else {
        // Drop in default SVG
        logoBox.innerHTML = `
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" style="max-height: 80px; width: auto; display: block;">
                <defs>
                    <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#0ea3e6"/><stop offset="100%" stop-color="#0456a9"/></linearGradient>
                    <linearGradient id="greyGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#555555"/><stop offset="100%" stop-color="#cdcdcd"/></linearGradient>
                    <linearGradient id="baseGrad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#0fa4eb"/><stop offset="100%" stop-color="#064f9b"/></linearGradient>
                    <clipPath id="screenClip"><path d="M 40,115 L 40,50 Q 40,30 60,30 L 140,30 Q 160,30 160,50 L 160,115 Z" /></clipPath>
                </defs>
                <g clip-path="url(#screenClip)">
                    <rect x="0" y="0" width="200" height="200" fill="url(#blueGrad)" />
                    <path d="M 70,115 C 110,80 140,50 170,10 L 200,10 L 200,150 L 70,150 Z" fill="url(#greyGrad)" />
                    <path d="M 10,130 C 90,100 130,60 180,-5 L 200,5 C 145,70 105,110 30,140 Z" fill="#ffffff" />
                </g>
                <polygon points="10,165 40,118 160,118 190,165" fill="url(#baseGrad)"/>
                <polygon points="73,165 83,145 117,145 127,165" fill="#ffffff"/>
                <rect x="10" y="170" width="180" height="12" fill="url(#baseGrad)"/>
            </svg>
        `;
    }
}

function closeModal(id) {
    document.getElementById(id).style.display = "none";
}


// --- Invoice Operations ---
function formatCurrency(amount) {
    if (isNaN(amount)) amount = 0;
    return parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function formatNumber(num) {
    if (isNaN(num)) num = 0;
    return parseFloat(num).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

let invoiceItems = [ { desc: "", months: "", qty: 1, price: 0.00 } ];

const els = {
    invNo: document.getElementById('invNo'),
    custName: document.getElementById('custName'),
    custAddr: document.getElementById('custAddr'),
    invDate: document.getElementById('invDate'),
    invType: document.getElementById('invType'),
    invPo: document.getElementById('invPo'),
    paidAmount: document.getElementById('paidAmount'),
    customerList: document.getElementById('customerList'),

    dInvNo: document.getElementById('displayInvNo'),
    dCustName: document.getElementById('displayCustName'),
    dCustAddr: document.getElementById('displayCustAddr'),
    dDate: document.getElementById('displayDate'),
    dType: document.getElementById('displayType'),
    dPo: document.getElementById('displayPo'),

    itemsList: document.getElementById('itemsList'),
    displayItems: document.getElementById('displayItems'),
    
    totalQty: document.getElementById('totalQty'),
    totalAmount: document.getElementById('totalAmount'),
    totalPaid: document.getElementById('totalPaid'),
    totalBalance: document.getElementById('totalBalance')
};

let customers = JSON.parse(localStorage.getItem('fazz_customers') || '{}');
let nextInvNo = localStorage.getItem('fazz_next_inv') || 'INV-000001';
els.invNo.value = nextInvNo;

// Customer History Modal
function renderCustomerList() {
    els.customerList.innerHTML = '';
    for (const name in customers) {
        let opt = document.createElement('option');
        opt.value = name;
        els.customerList.appendChild(opt);
    }
}
renderCustomerList();

function openHistoryModal() {
    document.getElementById('historyModal').style.display = "block";
    let tbody = document.getElementById('historyTbody');
    tbody.innerHTML = '';
    
    for (const name in customers) {
        let tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${name}</strong></td>
            <td>${customers[name]}</td>
            <td>
                <button class="history-use-btn" onclick="useCustomer('${name.replace(/'/g, "\\'")}')">Use</button>
                <button class="remove-btn" style="margin-left: 5px; padding: 6px 10px;" onclick="deleteCustomer('${name.replace(/'/g, "\\'")}')" title="Delete"><i data-feather="trash-2" style="width:12px; height:12px;"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    }
    feather.replace();
}

function useCustomer(name) {
    els.custName.value = name;
    els.custAddr.value = customers[name];
    updateHeaders();
    closeModal('historyModal');
}

function deleteCustomer(name) {
    if (confirm(`Are you sure you want to delete ${name}?`)) {
        delete customers[name];
        localStorage.setItem('fazz_customers', JSON.stringify(customers));
        renderCustomerList();
        openHistoryModal();
    }
}

els.custName.addEventListener('change', function() {
    if (customers[this.value]) {
        els.custAddr.value = customers[this.value];
        updateHeaders();
    }
});

let today = new Date();
els.invDate.value = String(today.getDate()).padStart(2, '0') + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + today.getFullYear();

['invNo', 'custName', 'custAddr', 'invDate', 'invType', 'invPo'].forEach(id => {
    if (els[id]) els[id].addEventListener('input', updateHeaders);
});
if (els.paidAmount) els.paidAmount.addEventListener('input', calculateTotals);

function updateHeaders() {
    els.dInvNo.textContent = els.invNo.value;
    els.dCustName.textContent = els.custName.value;
    els.dCustAddr.textContent = els.custAddr.value;
    els.dDate.textContent = els.invDate.value;
    els.dType.textContent = els.invType.value;
    if (els.dPo) els.dPo.textContent = els.invPo.value;
}
updateHeaders();

// Display List / Calculate
function renderItems() {
    els.itemsList.innerHTML = '';
    els.displayItems.innerHTML = '';
    
    invoiceItems.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'item-entry';
        div.innerHTML = `
            <div class="item-header">
                <strong>Item ${index + 1}</strong> 
                <button class="remove-btn" onclick="removeItem(${index})" title="Remove"><i data-feather="x" style="width:14px; height:14px;"></i></button>
            </div>
            <textarea placeholder="Description" rows="2" oninput="updateItem(${index}, 'desc', this.value)">${item.desc}</textarea>
            <div class="form-row">
                <div class="form-section half"><label>Warranty</label><input type="text" placeholder="(W) Months" value="${item.months}" oninput="updateItem(${index}, 'months', this.value)"></div>
                <div class="form-section half"><label>Qty</label><input type="number" step="1" placeholder="Qty" value="${item.qty}" oninput="updateItem(${index}, 'qty', this.value)"></div>
                <div class="form-section half"><label>Unit Price</label><input type="number" step="0.01" placeholder="Price" value="${item.price}" oninput="updateItem(${index}, 'price', this.value)"></div>
            </div>
        `;
        els.itemsList.appendChild(div);

        const qty = parseFloat(item.qty) || 0;
        const price = parseFloat(item.price) || 0;
        const amount = qty * price;

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td style="text-align: center;">${index + 1}.</td>
            <td style="white-space: pre-wrap;">${item.desc}</td>
            <td style="text-align: center;">${item.months}</td>
            <td style="text-align: center;">${formatNumber(qty)}</td>
            <td style="text-align: right;">${formatCurrency(price)}</td>
            <td style="text-align: right;">${formatCurrency(amount)}</td>
        `;
        els.displayItems.appendChild(tr);
    });

    calculateTotals();
    if (window.feather) feather.replace();
}

function calculateTotals() {
    let gTotalQty = 0;
    let gTotalAmount = 0;
    invoiceItems.forEach(item => {
        const qty = parseFloat(item.qty) || 0;
        const price = parseFloat(item.price) || 0;
        gTotalQty += qty;
        gTotalAmount += (qty * price);
    });

    const paidStr = els.paidAmount ? els.paidAmount.value : "0";
    let paidAmount = parseFloat(paidStr) || 0;
    let balance = gTotalAmount - paidAmount;

    els.totalQty.textContent = `${formatNumber(gTotalQty)} Pcs.`;
    els.totalAmount.textContent = formatCurrency(gTotalAmount);
    if (els.totalPaid && els.totalBalance && els.dType) {
        els.totalPaid.textContent = formatCurrency(paidAmount);
        els.totalBalance.textContent = formatCurrency(balance);
    }
}

function updateItem(index, key, value) {
    invoiceItems[index][key] = value;
    clearTimeout(window.renderTimer);
    window.renderTimer = setTimeout(renderTableOnly, 200);
}

function renderTableOnly() {
    els.displayItems.innerHTML = '';
    invoiceItems.forEach((item, index) => {
        const qty = parseFloat(item.qty) || 0;
        const price = parseFloat(item.price) || 0;
        const amount = qty * price;
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td style="text-align: center;">${index + 1}.</td>
            <td style="white-space: pre-wrap;">${item.desc}</td>
            <td style="text-align: center;">${item.months}</td>
            <td style="text-align: center;">${formatNumber(qty)}</td>
            <td style="text-align: right;">${formatCurrency(price)}</td>
            <td style="text-align: right;">${formatCurrency(amount)}</td>
        `;
        els.displayItems.appendChild(tr);
    });
    calculateTotals();
}

function addItem() {
    invoiceItems.push({ desc: "", months: "", qty: 1, price: 0 });
    renderItems();
}
function removeItem(index) {
    invoiceItems.splice(index, 1);
    renderItems();
}

function incrementInvoiceNumber(invString) {
    let parts = invString.match(/^(.*?)(\d+)$/);
    if (!parts) return invString + "-1"; 
    let prefix = parts[1];
    let numStr = parts[2];
    let numInc = (parseInt(numStr, 10) + 1).toString();
    while (numInc.length < numStr.length) { numInc = "0" + numInc; }
    return prefix + numInc;
}

function saveGenerateNew() {
    let cName = els.custName.value.trim();
    let cAddr = els.custAddr.value.trim();
    if (cName) {
        customers[cName] = cAddr;
        localStorage.setItem('fazz_customers', JSON.stringify(customers));
        renderCustomerList(); 
    }

    let currentInv = els.invNo.value.trim();
    let nextInv = incrementInvoiceNumber(currentInv);
    localStorage.setItem('fazz_next_inv', nextInv);

    els.invNo.value = nextInv;
    els.custName.value = "";
    els.custAddr.value = "";
    els.invPo.value = "";
    if (els.paidAmount) els.paidAmount.value = "0.00";
    invoiceItems = [{ desc: "", months: "", qty: 1, price: 0 }];
    
    renderItems();
    updateHeaders();
    alert("Invoice Saved! Ready for new invoice.");
}

function printInvoice() {
    window.print();
}

function adjustScale() {
    const wrapper = document.getElementById('previewWrapper');
    if (!wrapper) return;
    const authDisplay = window.getComputedStyle(document.getElementById('loginScreen')).display;
    if(authDisplay !== 'none') return;
    
    const availableWidth = window.innerWidth - 440; 
    const A5Width = 794; 
    if (availableWidth < A5Width && availableWidth > 0) {
        const scale = availableWidth / A5Width;
        wrapper.style.transform = `scale(${scale})`;
    } else {
        wrapper.style.transform = `scale(1)`;
    }
}
window.addEventListener('resize', adjustScale);

// Start
sessionStorage.removeItem('fazz_auth'); // Forced logout to let you see the animation
checkAuth();
