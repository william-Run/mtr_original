package com.gowell.mes.mtr.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.gowell.mes.mtr.Constants;
import com.gowell.mes.mtr.Result;
import com.gowell.mes.mtr.model.DeviceEntity;
import com.gowell.mes.mtr.repository.DeviceJpaRepository;
import com.gowell.mes.mtr.utils.StatusManager;

@RestController
@RequestMapping(path = "/api/mtr/curtain")
public class CurtainController {
	@Autowired
	DeviceJpaRepository deviceRepository;

	@Transactional
	@RequestMapping("/aeffect")
	public Result asynEffect(@RequestParam(required = true) String effectId) {
		List<DeviceEntity> devices = deviceRepository.findAllByCategory(Constants.DEVICE_CURTAIN);
		if (CollectionUtils.isEmpty(devices)) {
			return new Result(-1);
		}

		DeviceEntity device = devices.get(0);
		if (!StringUtils.isEmpty(device.getCmdstring()) || !"0".equals(device.getProperty1())) {
			return new Result(-2);
		}

		if (!effectId.equals("" + device.getOnoff())) {
			device.setProperty8("" + System.currentTimeMillis());
			device.setStatus(Constants.COMMAND_SETUP);
			device.setCmdstring(effectId);
			device.setTries(3);
			deviceRepository.save(device);
		}

		return new StatusManager().getStatus(deviceRepository);
	}
}
