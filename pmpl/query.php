<?php
  $builder = $this->modelsManager->createBuilder();
  $builder->columns([
    'T.id',
    'T.job_id',
    'T.tr_equipment_id',
    'T.container_type_id',
    'T.pickup_yard_id',
    'T.date',
    'T.vehicle_no',
    'T.lr_no',
    'T.product',
    'T.container_no',
    'T.invoice_no',
    'T.cancel',
    'T.receipt_no',
    'T.kms',
    'T.billing_rate',
    'T.percentage',
    'T.payable_rate',
    'T.t_total_expenses',
    'J.party_id',
    'J.unit_id',
    'J.type AS job_type',
    'J.id2_format',
    "T.tr_route_id AS trip_tr_route_id",
    "COALESCE(T.tr_route_id, J.tr_route_id) AS tr_route_id",
    "'No' AS documents",
  ]);

  $builder->from(['T' => 'IDEX\Models\Transport\TrTrips']);
		$builder->leftJoin('IDEX\Models\Exim\Jobs', 'J.id = T.job_id', 'J');
		$builder->where("T.date >= :from_date: AND T.date <= :to_date: AND J.party_id > 0 AND T.tr_equipment_id > 0", [
			'from_date' => $from_date->format('Y-m-d').' 00:00:00',
			'to_date'   => $to_date->format('Y-m-d').' 23:59:59',
		]);

		if (isset($post->search->id2_format) AND strlen($post->search->id2_format) > 0) {
			$builder->andWhere("J.id2_format = :id2_format:", [
				'id2_format' => $post->search->id2_format,
			]);
		}

		if (isset($post->search->party_id) AND intval($post->search->party_id) > 0) {
			$builder->andWhere("J.party_id = :party_id:", [
				'party_id' => $post->search->party_id,
			]);
		}

		if (isset($post->search->tr_equipment_id) AND intval($post->search->tr_equipment_id) > 0) {
			$builder->andWhere("T.tr_equipment_id = :tr_equipment_id:", [
				'tr_equipment_id' => $post->search->tr_equipment_id,
			]);
		}

		if (isset($post->search->tr_route_id) AND intval($post->search->tr_route_id) > 0) {
			$builder->andWhere("(T.tr_route_id = :tr_route_id: OR J.tr_route_id = :tr_route_id:)", [
				'tr_route_id' => $post->search->tr_route_id,
			]);
		}

		if (isset($post->search->company_type) AND strlen($post->search->company_type) > 0) {
			$tr_equipments = \IDEX\Models\Transport\TrEquipments::findByCompanyType($post->search->company_type);
			if ($tr_equipments) {
				$tr_equipment_ids = [];
				foreach ($tr_equipments as $r) {
					$tr_equipment_ids[] = $r->id;
				}
				$builder->andWhere("T.tr_equipment_id IN ({tr_equipment_ids:array})", [
					'tr_equipment_ids' => $tr_equipment_ids,
				]);
			}
		}

		if (isset($post->search->own_outside) AND strlen($post->search->own_outside) > 0) {
			$tr_equipments = \IDEX\Models\Transport\TrEquipments::findByOwnOutside($post->search->own_outside);
			if ($tr_equipments) {
				$tr_equipment_ids = [];
				foreach ($tr_equipments as $r) {
					$tr_equipment_ids[] = $r->id;
				}
				$builder->andWhere("T.tr_equipment_id IN ({tr_equipment_ids:array})", [
					'tr_equipment_ids' => $tr_equipment_ids,
				]);
			}
		}

		if (isset($post->search->tr_equipment_id) AND intval($post->search->tr_equipment_id) > 0) {
			$builder->andWhere("T.tr_equipment_id = :tr_equipment_id:", [
				'tr_equipment_id' => $post->search->tr_equipment_id,
			]);
		}

		if (isset($post->search->vehicle_owner) AND intval($post->search->vehicle_owner) > 0) {
			$party = \IDEX\Models\Master\Parties::findFirstById($post->search->vehicle_owner);
			if ($party) {
				$tr_equipments = \IDEX\Models\Transport\TrEquipments::findByPartyId($party->id);
				if ($tr_equipments) {
					$tr_equipment_ids = [];
					foreach ($tr_equipments as $r) {
						$tr_equipment_ids[] = $r->id;
					}
					$builder->andWhere("T.tr_equipment_id IN ({tr_equipment_ids:array})", [
						'tr_equipment_ids' => $tr_equipment_ids,
					]);
				}
			}
		}

		if (isset($post->search->unit_id) AND intval($post->search->unit_id) > 0) {
			$builder->andWhere("J.unit_id = :unit_id:", [
				'unit_id' => $post->search->unit_id,
			]);
		}

		if (isset($post->search->container_type_id) AND intval($post->search->container_type_id) > 0) {
			$builder->andWhere("T.container_type_id = :container_type_id:", [
				'container_type_id' => $post->search->container_type_id,
			]);
		}

		if (isset($post->search->job_type) AND strlen($post->search->job_type) > 0) {
			$builder->andWhere("J.type = :job_type:", [
				'job_type' => $post->search->job_type,
			]);
		}

		if (isset($post->search->cancel) AND strlen($post->search->cancel) > 0) {
			$builder->andWhere("T.cancel = :cancel:", [
				'cancel' => $post->search->cancel,
			]);
		}

		if (isset($post->search->invoice_no) AND strlen($post->search->invoice_no) > 0) {
			if ('0 No Invoice No' == $post->search->invoice_no) {
				$builder->andWhere("T.invoice_no = ''");
			} else {			
				$builder->andWhere("T.invoice_no = :invoice_no:", [
					'invoice_no' => $post->search->invoice_no,
				]);
			}
		}

		if (isset($post->search->receipt_no) AND strlen($post->search->receipt_no) > 0) {
			$builder->andWhere("T.receipt_no = :receipt_no:", [
				'receipt_no' => $post->search->receipt_no,
			]);
		}

		if (isset($post->search->pickup_yard_id) AND intval($post->search->pickup_yard_id) > 0) {
			$builder->andWhere("T.pickup_yard_id = :pickup_yard_id:", [
				'pickup_yard_id' => $post->search->pickup_yard_id,
			]);
		}

		if (isset($post->search->payable_rate) AND strlen($post->search->payable_rate) > 0) {
			if ('Zero' == $post->search->payable_rate) {
				$builder->andWhere("T.payable_rate = 0");
			} else {
				$builder->andWhere("T.payable_rate > 0");
			}
		}

		if (isset($post->search->billing_rate) AND strlen($post->search->billing_rate) > 0) {
			if ('Zero' == $post->search->billing_rate) {
				$builder->andWhere("T.billing_rate = 0");
			} else {
				$builder->andWhere("T.billing_rate > 0");
			}
		}

		$builder->groupBy('T.id');
		$builder->orderBy('T.date DESC');
		$result = $builder->getQuery()->execute()->toArray();