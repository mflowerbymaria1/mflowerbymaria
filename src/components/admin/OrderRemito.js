import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Helvetica', color: '#333' },
  header: { marginBottom: 20, borderBottom: 1, borderBottomColor: '#eee', paddingBottom: 10 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#E11D48' }, // Rose color
  subtitle: { fontSize: 10, color: '#666', marginTop: 4 },
  section: { marginVertical: 15 },
  sectionTitle: { fontSize: 12, fontWeight: 'bold', marginBottom: 8, textTransform: 'uppercase', color: '#666' },
  infoBox: { padding: 12, backgroundColor: '#FAFAFA', borderRadius: 4 },
  infoText: { fontSize: 10, marginBottom: 4 },
  table: { marginTop: 20 },
  tableHeader: { flexDirection: 'row', borderBottom: 1, borderBottomColor: '#eee', paddingBottom: 5, marginBottom: 5 },
  tableRow: { flexDirection: 'row', paddingVertical: 5 },
  col1: { flex: 3, fontSize: 10 },
  col2: { flex: 1, fontSize: 10, textAlign: 'center' },
  footer: { position: 'absolute', bottom: 40, left: 40, right: 40, textAlign: 'center', fontSize: 8, color: '#999' }
});

export const OrderRemito = ({ order }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>M•flower</Text>
        <Text style={styles.subtitle}>Remito Interno de Preparación | ID: {order.id}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Datos del Comprador</Text>
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>Nombre: {order.customer}</Text>
          <Text style={styles.infoText}>Dirección: {order.address || 'Calle Falsa 123, CABA'}</Text>
          <Text style={styles.infoText}>Teléfono: {order.phone || '11 1234 5678'}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Método de Envío</Text>
        <Text style={styles.infoText}>{order.shippingMethod || 'Envía - Correo Argentino'}</Text>
      </View>

      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.col1}>Producto</Text>
          <Text style={styles.col2}>Cantidad</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.col1}>Cuaderno A4 Pink Buenos Aires</Text>
          <Text style={styles.col2}>1</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.col1}>Set de Separadores A4</Text>
          <Text style={styles.col2}>1</Text>
        </tdView>
      </View>

      <Text style={styles.footer}>M•flower by Maria - Todos los derechos reservados.</Text>
    </Page>
  </Document>
);
