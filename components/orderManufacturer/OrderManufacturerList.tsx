'use client';

import { OrderManufacturer } from '@/entities/order-manufacturer';
import { getAllOrderManufacturers } from '@/services/orderManufacturer/getOrderManufacturer';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

export default function OrderManufacturerList() {
  const [orderManufacturers, setOrderManufacturers] = useState<
    OrderManufacturer[]
  >([]);
  const [filteredOrderManufacturers, setFilteredOrderManufacturers] = useState<
    OrderManufacturer[]
  >([]);
  const [activeTab, setActiveTab] = useState<
    'All' | 'Processing' | 'Delivered'
  >('All');

  useEffect(() => {
    getAllOrderManufacturers().then((data) => {
      setOrderManufacturers(data);
      filterOrders(data, 'All');
    });
  }, []);

  const filterOrders = (
    orders: OrderManufacturer[],
    tab: 'All' | 'Processing' | 'Delivered',
  ) => {
    if (tab === 'All') {
      setFilteredOrderManufacturers(orders);
    } else if (tab === 'Processing') {
      const filtered = orders.filter((order) =>
        order.OrderDevices.some((od) => !od.device.stockDate),
      );
      setFilteredOrderManufacturers(filtered);
    } else if (tab === 'Delivered') {
      const filtered = orders.filter((order) =>
        order.OrderDevices.some((od) => od.device.stockDate),
      );
      setFilteredOrderManufacturers(filtered);
    }
  };

  const handleTabClick = (tab: 'All' | 'Processing' | 'Delivered') => {
    setActiveTab(tab);
    filterOrders(orderManufacturers, tab);
  };

  return (
    <div className="overflow-x-auto">
      <div role="tablist" className="tabs tabs-bordered">
        <button
          role="tab"
          className={`tab ${activeTab === 'All' ? 'tab-active' : ''}`}
          onClick={() => handleTabClick('All')}
        >
          All
        </button>
        <button
          role="tab"
          className={`tab ${activeTab === 'Processing' ? 'tab-active' : ''}`}
          onClick={() => handleTabClick('Processing')}
        >
          Processing
        </button>
        <button
          role="tab"
          className={`tab ${activeTab === 'Delivered' ? 'tab-active' : ''}`}
          onClick={() => handleTabClick('Delivered')}
        >
          Delivered
        </button>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Manufacturers</th>
            <th>Amount</th>
            <th>Order Date</th>
            <th>Stock In Date</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrderManufacturers.map((order, index) => {
            const manufacturerNames = order.OrderDevices.map(
              (od) => od.device.manufacturer.name,
            ).join(', ');
            const stockInDates = order.OrderDevices.map((od) =>
              od.device.stockDate
                ? dayjs(od.device.stockDate).format('MM/DD/YYYY')
                : 'N/A',
            ).join(', ');

            return (
              <tr key={order.id}>
                <th>{index + 1}</th>
                <td>{manufacturerNames}</td>
                <td>{order.amount}</td>
                <td>{dayjs(order.orderDate).format('MM/DD/YYYY')}</td>
                <td>{stockInDates}</td>
                <td>
                  {order.OrderDevices.some((od) => od.device.stockDate) ? (
                    <button className="btn btn-outline btn-success btn-sm">
                      Delivered
                    </button>
                  ) : (
                    <button className="btn btn-outline btn-primary btn-sm">
                      View Detail
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
