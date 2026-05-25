import { MercadoPagoConfig, Preference } from 'mercadopago';

const client = new MercadoPagoConfig({
    accessToken: 'TEST-8742130997983131-103116-05e17df890af026b713a16c7dbf35018-352982914'
});

async function test() {
    try {
        const preference = new Preference(client);
        const response = await preference.create({
            body: {
                items: [{
                    id: '1',
                    title: 'Test',
                    unit_price: 100,
                    quantity: 1,
                    currency_id: 'ARS'
                }],
                payer: {
                    name: 'T',
                    surname: 'T',
                    email: 't@t.com'
                },
                statement_descriptor: 'MFLOWERBYMARIA'
            }
        });
        console.log("SUCCESS:", response.sandbox_init_point, response.init_point);
    } catch (e) {
        console.error("ERROR:", e);
    }
}
test();
