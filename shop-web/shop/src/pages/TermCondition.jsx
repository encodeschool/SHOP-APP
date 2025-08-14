import React from "react";

export default function TermCondition() {
  return (
    <div className="container mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Terms & Conditions</h1>

      <p className="mb-4">
        To avoid misunderstandings when placing an order, please read the
        following terms when purchasing the product on the website <span className="font-semibold">4games.pro</span>.
      </p>

      <h2 className="text-xl font-semibold mb-2">General conditions:</h2>
      <ul className="list-disc list-inside space-y-2 mb-6">
        <li>
          On the website <span className="font-semibold">4GAMES.PRO</span> all prices for goods are indicated with VAT (21%).
        </li>
        <li>
          Item prices do not include shipping. Delivery is a separate service, the cost of which is calculated when placing the order.
        </li>
        <li>
          There are two ways to pay for your order: upon receiving the product or by paying through the website. Online payment (prepayment)
          is required for delivery methods such as DPD Pickup Point, Omniva, or Latvijas Pasts. For other methods (home delivery or store pickup),
          you may pay upon receipt.
        </li>
        <li>
          An email address must be provided when placing an order so we can send order updates, invoices, or other necessary documentation.
        </li>
        <li>
          Before using the purchased product, please carefully read the user manual and only use the product as intended and recommended by the manufacturer.
        </li>
        <li>
          Handle the purchased equipment with care during the entire warranty period. Keep the original packaging and related documents.
        </li>
        <li>
          Products are returned and accepted under warranty in accordance with Latvian Republic (LR) distance contract terms.
        </li>
        <li>
          For returns and warranty service, please write to <span className="text-blue-600">4games@4games.lv</span> with your order number.
        </li>
      </ul>

      <h2 className="text-xl font-semibold mb-2">Warranty and Disclaimer:</h2>
      <p className="mb-4">
        All materials and prices listed on the website are for informational purposes only and do not constitute a public advertising offer.
        For up-to-date prices and stock availability, contact us via phone or email at <span className="text-blue-600">4games@4games.lv</span>.
      </p>

      <p className="mt-6">
        Thanks for reading. We will be happy to receive your order at any time.
        <br />
        Wishing you a successful purchase,<br />
        <span className="font-semibold">Your 4games.PRO team!</span>
      </p>
    </div>
  );
}
