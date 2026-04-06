package com.brelinx.move.models;

import jakarta.persistence.*;

@Entity
@Table(name = "trips")
public class Trip {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String originCity;

    @Column(nullable = false)
    private String destinationCity;

    @Column(nullable = false)
    private String status;

    private Long driverId;

    @Column(nullable = false)
    private Long riderId;

    public Trip() {}

    public Trip(Long id, String originCity, String destinationCity, String status, Long driverId, Long riderId) {
        this.id = id; this.originCity = originCity; this.destinationCity = destinationCity;
        this.status = status; this.driverId = driverId; this.riderId = riderId;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getOriginCity() { return originCity; }
    public void setOriginCity(String originCity) { this.originCity = originCity; }
    public String getDestinationCity() { return destinationCity; }
    public void setDestinationCity(String destinationCity) { this.destinationCity = destinationCity; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Long getDriverId() { return driverId; }
    public void setDriverId(Long driverId) { this.driverId = driverId; }
    public Long getRiderId() { return riderId; }
    public void setRiderId(Long riderId) { this.riderId = riderId; }
}
