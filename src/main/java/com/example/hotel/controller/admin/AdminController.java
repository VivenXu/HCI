package com.example.hotel.controller.admin;

import com.example.hotel.bl.admin.AdminService;
import com.example.hotel.blImpl.admin.AdminServiceImpl;
import com.example.hotel.vo.ResponseVO;
import com.example.hotel.vo.UserForm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * @Author: chenyizong
 * @Date: 2020-03-04
 */
@RestController()
@RequestMapping("/api/admin")
public class AdminController {
    @Autowired
    AdminService adminService;

    @PostMapping("/addManager")
    public ResponseVO addManager(@RequestBody UserForm userForm){

        return adminService.addManager(userForm);
    }

    @PostMapping("/getAllManagers")
    public ResponseVO getAllManagers(){
        return ResponseVO.buildSuccess(adminService.getAllManagers());
    }

    @PostMapping("/getAllUsers")
    public ResponseVO getAllUsers() {
        return ResponseVO.buildSuccess(adminService.getAllUsers());
    }
}
