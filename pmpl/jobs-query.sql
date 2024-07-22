Select * from (
  Select 
    'STS' as code,
    T.id, T.job_id, T.tr_equipment_id, T.container_type_id, T.pickup_yard_id, 
    T.date, T.vehicle_no, T.lr_no, T.product, T.container_no, T.invoice_no, 
    T.cancel, T.receipt_no, T.kms, T.billing_rate, T.percentage, T.payable_rate, 
    T.t_total_expenses, J.party_id, J.unit_id, J.type AS job_type, J.id2_format, 
    T.tr_route_id AS trip_tr_route_id, COALESCE(T.tr_route_id, J.tr_route_id) AS tr_route_id, 
    'No' AS documents, J.tr_route_id as job_tr_route_id
  from tr_trips as T
  left join jobs as J 
    on J.id = T.job_id
  where J.party_id > 0 AND T.tr_equipment_id > 0
  UNION
  Select 
    'PCF' as code,
    T.id, T.job_id, T.tr_equipment_id, T.container_type_id, T.pickup_yard_id, 
    T.date, T.vehicle_no, T.lr_no, T.product, T.container_no, T.invoice_no, 
    T.cancel, T.receipt_no, T.kms, T.billing_rate, T.percentage, T.payable_rate, 
    T.t_total_expenses, J.party_id, J.unit_id, J.type AS job_type, J.id2_format, 
    T.tr_route_id AS trip_tr_route_id, COALESCE(T.tr_route_id, J.tr_route_id) AS tr_route_id, 
    'No' AS documents, J.tr_route_id as job_tr_route_id
  from tr_trips as T
  left join jobs as J 
    on J.id = T.job_id
  where J.party_id > 0 AND T.tr_equipment_id > 0
) as D
group by code, id
order by date desc
limit 100

-- Filters
-- T.date -> Y
-- J.id2_format -> Y
-- J.party_id -> Y
-- T.tr_equipment_id -> Y
-- T.tr_route_id -> Y
-- J.tr_route_id -> N
-- J.unit_id -> Y
-- T.container_type_id -> Y
-- J.type -> Y
-- T.cancel -> Y
-- T.invoice_no -> Y
-- T.receipt_no -> Y
-- T.pickup_yard_id -> Y
-- T.payable_rate -> Y
-- T.billing_rate -> Y