/**
 * Invoice Generator Application
 * Main JavaScript for the professional invoice generator
 */

const GOOGLE_CLIENT_ID = '571339195704-h27i7flf8fp0l46enksh7hthe7rvp37d.apps.googleusercontent.com';
let googleUser = null;
let googleAccessToken = null;
let tokenClient = null;
let isLoggedIn = false;

function setButtonsEnabled(enabled) {
    document.querySelector(".btn-save").disabled = !enabled;
    document.querySelector(".btn-delete").disabled = !enabled;
    document.getElementById("clientSelect").disabled = !enabled;
}

window.addEventListener('DOMContentLoaded', function () {
    setButtonsEnabled(false);

    google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse
    });
    google.accounts.id.renderButton(
        document.getElementById("googleSignInBtn"),
        { theme: "outline", size: "large", text: "signin_with", width: 220 }
    );
    document.getElementById('signout-button').onclick = signOut;
    document.getElementById('date').valueAsDate = new Date();
    document.getElementById('item-rows').addEventListener('input', updateTotals);
    document.getElementById('vatRate').addEventListener('input', updateTotals);
    document.getElementById('logoUpload').addEventListener('change', handleLogoUpload);
    updateTotals();

    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: 'https://www.googleapis.com/auth/drive.file',
        callback: (tokenResponse) => {
            googleAccessToken = tokenResponse.access_token;
            isLoggedIn = true;
            setButtonsEnabled(true);
            showNotification('Mit Google Drive verbunden', 'success');
        }
    });
});

function handleLogoUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (ev) {
        const img = document.getElementById('logoPreview');
        img.src = ev.target.result;
        img.style.display = 'block';
    };
    reader.readAsDataURL(file);
}

function handleCredentialResponse(response) {
    const userObject = parseJwt(response.credential);
    googleUser = userObject;
    document.getElementById('signin-text').textContent = '🔐 Angemeldet als ' + (userObject.email || '');
    document.getElementById('googleSignInBtn').style.display = 'none';
    document.getElementById('signout-button').style.display = 'inline-flex';
    tokenClient.requestAccessToken();
}

function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}

function signOut() {
    google.accounts.id.disableAutoSelect();
    googleUser = null;
    googleAccessToken = null;
    isLoggedIn = false;
    setButtonsEnabled(false);
    document.getElementById('signin-text').textContent = '🔓 Nicht angemeldet';
    document.getElementById('googleSignInBtn').style.display = 'inline-block';
    document.getElementById('signout-button').style.display = 'none';
    document.getElementById('clientSelect').innerHTML = '<option value="">Neuen Kunden anlegen</option>';
}

async function findFileId(name) {
    if (!googleAccessToken) {
        showNotification('Bitte anmelden!', 'error');
        return null;
    }
    const res = await fetch('https://www.googleapis.com/drive/v3/files?q=' +
        encodeURIComponent(`name='${name}' and trashed=false`) +
        '&fields=files(id,name)', {
        headers: { Authorization: 'Bearer ' + googleAccessToken }
    });
    const data = await res.json();
    return data.files && data.files[0] ? data.files[0].id : null;
}

async function saveFileAsPDF(name, pdfBlob) {
    if (!googleAccessToken) {
        showNotification('Bitte anmelden!', 'error');
        return;
    }
    const metadata = { name: name, mimeType: 'application/pdf' };
    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', pdfBlob);

    const existingId = await findFileId(name);
    if (existingId) {
        await fetch('https://www.googleapis.com/upload/drive/v3/files/' + existingId + '?uploadType=multipart', {
            method: 'PATCH',
            headers: { Authorization: 'Bearer ' + googleAccessToken },
            body: form
        });
    } else {
        await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
            method: 'POST',
            headers: { Authorization: 'Bearer ' + googleAccessToken },
            body: form
        });
    }
}

async function saveClient() {
    if (!isLoggedIn || !googleAccessToken) {
        showNotification('Bitte zuerst anmelden!', 'error');
        return;
    }

    const pdfBlob = await generatePDF({ saveOnly: true });
    const data = getFormData();
    if (!data.client) {
        showNotification('Bitte Kundennamen eingeben', 'error');
        return;
    }
    const pdfName = `Rechnung_${data.client}_${data.invoiceNumber || getNextInvoiceNumber()}.pdf`;
    await saveFileAsPDF(pdfName, pdfBlob);
    showNotification('Kunde gespeichert (PDF in Google Drive)!', 'success');
}

function deleteClient() {
    showNotification('Funktion noch nicht implementiert', 'error');
}

function updateTotals() {
    let subtotal = 0;
    document.querySelectorAll('#item-rows tr').forEach(row => {
        const qty = parseFloat(row.querySelector('.item-qty').value) || 0;
        const price = parseFloat(row.querySelector('.item-price').value) || 0;
        const total = qty * price;
        row.querySelector('.item-total').textContent = total.toFixed(2) + ' €';
        subtotal += total;
    });
    const vat = parseFloat(document.getElementById('vatRate').value) || 20;
    const vatAmt = subtotal * vat / 100;
    document.getElementById('subtotal').textContent = subtotal.toFixed(2) + ' €';
    document.getElementById('vatAmount').textContent = vatAmt.toFixed(2) + ' €';
    document.getElementById('totalAmount').textContent = (subtotal + vatAmt).toFixed(2) + ' €';
    document.getElementById('vatRateLabel').textContent = vat.toFixed(1);
}

function addRow() {
    const row = document.createElement('tr');
    row.innerHTML = `
    <td><input type="text" class="item-desc" required /></td>
    <td><input type="number" class="item-qty" value="1" min="1" /></td>
    <td><input type="number" class="item-price" value="0.00" step="0.01" required /></td>
    <td class="item-total">0.00 €</td>
    <td><button onclick="removeRow(this)" class="remove-btn">×</button></td>`;
    document.getElementById('item-rows').appendChild(row);
    row.querySelector('.item-qty').addEventListener('input', updateTotals);
    row.querySelector('.item-price').addEventListener('input', updateTotals);
    updateTotals();
}

function removeRow(btn) {
    const row = btn.closest('tr');
    if (document.querySelectorAll('#item-rows tr').length > 1) {
        row.remove();
    } else {
        row.querySelector('.item-desc').value = '';
        row.querySelector('.item-qty').value = 1;
        row.querySelector('.item-price').value = '0.00';
        row.querySelector('.item-total').textContent = '0.00 €';
    }
    updateTotals();
}

function fillClientFromSelect() {
    const sel = document.getElementById('clientSelect');
    const val = sel.value;
    document.getElementById('client').value = val;
}

function getFormData() {
    return {
        company: document.getElementById('company').value.trim(),
        client: document.getElementById('client').value.trim(),
        date: document.getElementById('date').value,
        invoiceNumber: document.getElementById('invoiceNumber').value.trim(),
        vatRate: parseFloat(document.getElementById('vatRate').value) || 20,
        footerNote: document.getElementById('footerNote').value.trim(),
        items: Array.from(document.querySelectorAll('#item-rows tr')).map(r => ({
            desc: r.querySelector('.item-desc').value,
            qty: +r.querySelector('.item-qty').value || 0,
            price: +r.querySelector('.item-price').value || 0
        }))
    };
}

function getNextInvoiceNumber() {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const key = `lastInvoice-${year}-${month}`;
    let num = parseInt(localStorage.getItem(key)) || 0;
    num++;
    localStorage.setItem(key, num);
    return `RE-${year}${month}-${String(num).padStart(3, '0')}`;
}

function checkRequired() {
    const missing = [];
    if (!document.getElementById('company').value.trim()) missing.push('Firma');
    if (!document.getElementById('client').value.trim()) missing.push('Kunde');
    if (!document.getElementById('date').value) missing.push('Datum');
    const items = Array.from(document.querySelectorAll('#item-rows tr'));
    if (!items.some(r => r.querySelector('.item-desc').value.trim() && parseFloat(r.querySelector('.item-price').value) > 0))
        missing.push('Mindestens eine Position mit Preis>0');
    return missing;
}

function showNotification(msg, type = 'info') {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    const notification = document.createElement('div');
    notification.className = 'notification ' + type;
    notification.innerHTML = `<div>${msg}</div><button onclick="this.parentNode.remove()">OK</button>`;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 5000);
}

async function generatePDF(opts) {
    const missing = checkRequired();
    if (missing.length) {
        if (!opts || !opts.saveOnly) showNotification('Bitte ausfüllen: ' + missing.join(', '), 'error');
        return;
    }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const data = getFormData();
    const invoiceNum = data.invoiceNumber || getNextInvoiceNumber();
    const vat = data.vatRate || 20;

    if (document.getElementById('logoUpload').files[0]) {
        try {
            const reader = new FileReader();
            reader.readAsDataURL(document.getElementById('logoUpload').files[0]);
            await new Promise(resolve => reader.onload = resolve);
            const img = new Image();
            img.src = reader.result;
            await new Promise(resolve => img.onload = resolve);
            doc.addImage(img, 'PNG', 15, 15, 50, (img.height * 50) / img.width);
        } catch (error) {
            console.error('Error loading logo:', error);
        }
    }

    let y = 15;
    doc.setFontSize(18).text('RECHNUNG', 205, y, { align: 'right' });
    y += 10;
    doc.setFontSize(10).text(`Rechnungsnr: ${invoiceNum}`, 205, y, { align: 'right' });
    y += 6;
    doc.text(`Datum: ${data.date}`, 205, y, { align: 'right' });
    y += 15;
    doc.setFontSize(12).setFont('helvetica', 'bold').text(data.company, 15, y);
    y += 7;
    doc.setFont('helvetica', 'normal').text('Rechnung an: ' + data.client, 15, y);
    y += 20;

    const headers = [['Pos', 'Beschreibung', 'Menge', 'Einzelpreis', 'Gesamt']];
    const rows = data.items.map((item, i) => [
        i + 1,
        item.desc,
        item.qty,
        item.price.toFixed(2).replace('.', ','),
        (item.qty * item.price).toFixed(2).replace('.', ',')
    ]);

    doc.autoTable({
        startY: y,
        head: headers,
        body: rows,
        theme: 'grid',
        headStyles: { fillColor: [52, 152, 219], textColor: 255, fontStyle: 'bold' },
        styles: { fontSize: 10, cellPadding: 4 },
        columnStyles: {
            0: { cellWidth: 15 },
            1: { cellWidth: 80 },
            2: { cellWidth: 20 },
            3: { cellWidth: 30 },
            4: { cellWidth: 30 }
        }
    });

    y = doc.lastAutoTable.finalY + 10;
    const subtotal = data.items.reduce((sum, item) => sum + item.qty * item.price, 0);
    const vatAmt = subtotal * vat / 100;
    const total = subtotal + vatAmt;

    doc.setFontSize(12).setFont('helvetica', 'normal')
        .text(`Zwischensumme: ${subtotal.toFixed(2).replace('.', ',')} €`, 205, y, { align: 'right' });
    y += 7;
    doc.text(`MwSt (${vat}%): ${vatAmt.toFixed(2).replace('.', ',')} €`, 205, y, { align: 'right' });
    y += 7;
    doc.setFont('helvetica', 'bold').text(`Gesamtsumme: ${total.toFixed(2).replace('.', ',')} €`, 205, y, { align: 'right' });
    y += 15;

    if (data.footerNote) {
        doc.setFontSize(10).text(data.footerNote, 15, y);
    }

    if (opts && opts.saveOnly) {
        return new Promise(resolve => {
            const pdfBlob = doc.output('blob');
            resolve(pdfBlob);
        });
    } else {
        doc.save(`Rechnung_${invoiceNum}.pdf`);
        showNotification('Rechnung erstellt', 'success');
    }
}
