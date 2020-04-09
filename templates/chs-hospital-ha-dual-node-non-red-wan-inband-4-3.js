/*
################################################################################
#                                                                              #
# Put config text with variables enclosed in the following <pre></pre> tags.   #
# Variables enclosed in double curly braces.  Example:                         #
#  {{ variableName }}                                                          #
#                                                                              #
################################################################################
*/
let template = `config
    authority

        router       {{ model.routerName }}
            name                  {{ model.routerName }}
            location              "{{ model.siteAddress }}"
            location-coordinates  {{ model.siteCoordinates }}
            router-group          hospitals
            inter-node-security   encrypt-hmac-disabled

            system
                ntp

                    server  {{ model.ntp1 }}
                        ip-address  {{ model.ntp1 }}
                    exit

                    server  {{ model.ntp2 }}
                        ip-address  {{ model.ntp2 }}
                    exit
                exit

                services

                    snmp-server
                        enabled                true
                        port                   162

                        notification-receiver  {{ model.trapServer1 }} 162 trap
                            ip-address  {{ model.trapServer1 }}
                            port        162
                            type        trap
                        exit
                    exit
                exit
            exit

            node                        {{ model.node1Name }}
                name                    {{ model.node1Name }}
                role                    combo

                device-interface          AVPN1-enp1s0
                    name                  AVPN1-enp1s0
                    type                  ethernet
                    pci-address           0000:01:00.0

                    network-interface     AVPN1-vlan0
                        name                 AVPN1-vlan0
                        type                 external
                        conductor            true

                        neighborhood         DC-MPLS
                            name                DC-MPLS
                            topology            spoke
                            vector              MPLS-01
                        exit
                        inter-router-security   peer-sec
                        source-nat           true

                        address              {{ model.wanAddr1 }}
                            ip-address     {{ model.wanAddr1 }}
                            prefix-length  {{ model.wanPrefix1 }}
                            gateway        {{ model.wanGw1 }}
                        exit
                    exit
                 exit

                 device-interface         LAN-enp2s0
                    name                  LAN-enp2s0
                    type                  ethernet
                    pci-address           0000:02:00.0
                    shared-phys-address   {{ model.lanSharedMAC }}

                    network-interface     LAN-vlan2020
                        name                 LAN-vlan2020
                        global-id            3
                        type                 external
                        vlan                 2020
                        neighborhood         {{ model.routerName }}-lan1
                            name  {{ model.routerName }}-lan1
                        exit

                        neighborhood         {{ model.routerName }}-lan2
                            name  {{ model.routerName }}-lan2
                        exit
                        inter-router-security  peer-sec

                        address              {{ model.lanAddr }}
                            ip-address     {{ model.lanAddr }}
                            prefix-length  {{ model.lanPrefix }}
                        exit
                    exit

                    network-interface     LAN-vlan2030
                        name                 LAN-vlanvlan2030
                        global-id            4
                        type                 external
                        vlan                 2030
                        tenant               chs-guest

                        address              192.168.0.1
                            ip-address     192.168.0.1
                            prefix-length  18
                        exit
                    exit
                exit

                device-interface            fabric-enp3s0
                    name               fabric-enp3s0
                    description        "HA fabric/dogleg link"
                    type               ethernet
                    pci-address        0000:03:00.0

                    network-interface  ha-fabric
                        name               ha-fabric
                        type               fabric

                        address            169.254.252.1
                            ip-address     169.254.252.1
                            prefix-length  30
                        exit
                    exit
                exit

                device-interface            sync-enp4s0
                    name               sync-enp4s0
                    description        "HA state synchronization link"
                    type               ethernet
                    pci-address        0000:04:00.0
                    forwarding         false

                    network-interface  ha-sync
                        name               ha-sync
                        type               fabric

                        address            169.254.253.1
                            ip-address     169.254.253.1
                            prefix-length  30
                        exit

                        ifcfg-option     ZONE
                            name            ZONE
                            value           trusted
                        exit
                    exit
                exit

                device-interface       msbr-enp5s0
                    name               msbr-enp5s0
                    description        "Internal interface between OSN and MSBR"
                    type               ethernet
                    pci-address        0000:05:00.0

                    network-interface  msbr-mgmt
                        name               msbr-mgmt
                        type               external
                        vlan               128
                        tenant             ics-mgmt
                        source-nat         true

                        address            100.111.15.254
                            ip-address     100.111.15.254
                            prefix-length  20
                        exit
                    exit

                    network-interface     msbr-vlan{{ model.MSBRVoiceVlan }}
                        name                 LAN-vlan{{ model.MSBRVoiceVlan }}
                        type                 external
                        vlan                 {{ model.MSBRVoiceVlan }}
                        tenant               voice.chs-site

                        address              {{ model.MSBRVoiceAddr }}
                            ip-address     {{ model.MSBRVoiceAddr }}
                            prefix-length  {{ model.MSBRVoicePrefix }}
                        exit
                    exit
                exit

                device-interface         loopback
                    name                 loopback
                    type                 host

                    network-interface    loopback-mgmt
                        name                 loopback-mgmt
                        default-route        true
                        tenant               ics-mgmt

                        management-vector
                            name           loopback
                            priority       100
                        exit

                        address            100.111.0.1
                            ip-address        100.111.0.1
                            gateway           {{ model.node1OSNLoopback }}
                            prefix-length     31
                        exit

                        ifcfg-option     DNS1
                            name            DNS1
                            value           {{ model.DNS1 }}
                        exit

                        ifcfg-option     DNS2
                            name            DNS2
                            value           {{ model.DNS2 }}
                        exit
                    exit
                exit
            exit

            node                        {{ model.node2Name }}
                name                    {{ model.node2Name }}
                role                    combo

                device-interface          ADI-enp1s0
                    name                  ADI-enp1s0
                    type                  ethernet
                    pci-address           0000:01:00.0

                    network-interface     ADI-vlan0
                        name                 ADI-vlan0
                        type                 external
                        conductor            true

                        neighborhood         DC-Internet-Broadband
                            name                DC-Internet-Broadband
                            topology            spoke
                            vector              Broadband-01
                        exit

                        neighborhood         ICS-NOC-Broadband
                            name                ICS-NOC-Broadband
                            topology            spoke
                            vector              Broadband-01
                        exit

                        neighborhood         CRWD-Internet-Broadband
                            name                CRWD-Internet-Broadband
                            topology            hub
                            vector              Broadband-01
                        exit
                        inter-router-security   peer-sec
                        source-nat           true

                        address              {{ model.wanAddr2 }}
                            ip-address     {{ model.wanAddr2 }}
                            prefix-length  {{ model.wanPrefix2 }}
                            gateway        {{ model.wanGw2 }}
                        exit
                    exit
                 exit

                 device-interface         LAN-enp2s0
                    name                  LAN-enp2s0
                    type                  ethernet
                    pci-address           0000:02:00.0
                    shared-phys-address   {{ model.lanSharedMAC }}

                    network-interface     LAN-vlan2020
                        name                 LAN-vlan2020
                        global-id            3
                        type                 external
                        vlan                 2020
                        neighborhood         {{ model.routerName }}-lan1
                            name  {{ model.routerName }}-lan1
                        exit

                        neighborhood         {{ model.routerName }}-lan2
                            name  {{ model.routerName }}-lan2
                        exit
                        inter-router-security  peer-sec

                        address              {{ model.lanAddr }}
                            ip-address     {{ model.lanAddr }}
                            prefix-length  {{ model.lanPrefix }}
                        exit
                    exit

                    network-interface     LAN-vlan2030
                        name                 LAN-vlanvlan2030
                        global-id            4
                        type                 external
                        vlan                 2030
                        tenant               chs-guest

                        address              192.168.0.1
                            ip-address     192.168.0.1
                            prefix-length  18
                        exit
                    exit
                exit

                device-interface            fabric-enp3s0
                    name               fabric-enp3s0
                    description        "HA fabric/dogleg link"
                    type               ethernet
                    pci-address        0000:03:00.0

                    network-interface  ha-fabric
                        name               ha-fabric
                        type               fabric

                        address            169.254.252.2
                            ip-address     169.254.252.2
                            prefix-length  30
                        exit
                    exit
                exit

                device-interface            sync-enp4s0
                    name               sync-enp4s0
                    description        "HA state synchronization link"
                    type               ethernet
                    pci-address        0000:04:00.0
                    forwarding         false

                    network-interface  ha-sync
                        name               ha-sync
                        type               fabric

                        address            169.254.253.2
                            ip-address     169.254.253.2
                            prefix-length  30
                        exit
                    exit
                exit

                device-interface       msbr-enp5s0
                    name               msbr-enp5s0
                    description        "Internal interface between OSN and MSBR"
                    type               ethernet
                    pci-address        0000:05:00.0

                    network-interface  msbr-mgmt
                        name               msbr-mgmt
                        type               external
                        vlan               128
                        tenant             ics-mgmt
                        source-nat         true

                        address            100.111.15.254
                            ip-address     100.111.15.254
                            prefix-length  20
                        exit
                    exit

                    network-interface     msbr-vlan{{ model.MSBRVoiceVlan }}
                        name                 LAN-vlan{{ model.MSBRVoiceVlan }}
                        type                 external
                        vlan                 {{ model.MSBRVoiceVlan }}
                        tenant               voice.chs-site

                        address              {{ model.MSBRVoiceAddr }}
                            ip-address     {{ model.MSBRVoiceAddr }}
                            prefix-length  {{ model.MSBRVoicePrefix }}
                        exit
                    exit
                exit

                device-interface  LTE-ATT
                    name               LTE-ATT
                    type               lte
                    target-interface   wwp0s21f0u4i4

                    lte
                        apn-name  {{ model.LTEnode2APN }}
                    exit

                    network-interface  lte-dhcp
                        name                   lte-dhcp

                        neighborhood           DC-Internet-LTE
                            name                DC-Internet-LTE
                            peer-connectivity   outbound-only
                            vector              LTE

                            bfd
                                state                     enabled
                                desired-tx-interval       60000
                                required-min-rx-interval  60000
                                link-test-interval        120
                            exit

                            udp-transform
                                mode  always-transform
                            exit

                            path-mtu-discovery
                                enabled  true
                            exit
                        exit
                        inter-router-security  peer-sec
                        source-nat             true
                        dhcp                   v4
                    exit
                exit

                device-interface         loopback
                    name                 loopback
                    type                 host

                    network-interface    loopback-mgmt
                        name                 loopback-mgmt
                        default-route        true
                        tenant               ics-mgmt

                        management-vector
                            name           loopback
                            priority       100
                        exit

                        address            100.111.0.1
                            ip-address        100.111.0.1
                            gateway           {{ model.node2OSNLoopback }}
                            prefix-length     20
                        exit

                        ifcfg-option     DNS1
                            name            DNS1
                            value           {{ model.DNS1 }}
                        exit

                        ifcfg-option     DNS2
                            name            DNS2
                            value           {{ model.DNS2 }}
                        exit
                    exit
                exit
            exit

            service-route     local-{{ model.routerName }}-LAN-summary
                name          local-{{ model.routerName }}-LAN-summary
                service-name  {{ model.routerName }}-LAN-summary

                next-hop      {{ model.node1Name }} LAN-vlan2020
                        node-name  {{ model.node1Name }}
                        interface  LAN-vlan2020
                exit

                next-hop      {{ model.node2Name }} LAN-vlan2020
                        node-name  {{ model.node1Name }}
                        interface  LAN-vlan2020
                exit
            exit

            service-route     static-guest-wifi
               name          static-guest-wifi
               service-name  guest-wifi

               next-hop      {{ model.node2Name }} ADI-vlan0
                        node-name  {{ model.node2Name }}
                        interface  ADI-vlan0
                        gateway-ip {{ model.wanGw2 }}
               exit
            exit

            service-route     static-{{ model.node1Name }}-osn-mgmt
                name          static-{{ model.node1Name }}-osn-mgmt
                service-name  {{ model.node1Name }}-osn-mgmt

                next-hop      {{ model.node1Name }} loopback-mgmt
                        node-name  {{ model.node1Name }}
                        interface  loopback-mgmt
                exit
            exit

            service-route     static-{{ model.node2Name }}-osn-mgmt
                name          static-{{ model.node2Name }}-osn-mgmt
                service-name  {{ model.node2Name }}-osn-mgmt

                next-hop      {{ model.node2Name }} loopback-mgmt
                        node-name  {{ model.node2Name }}
                        interface  loopback-mgmt
                exit
            exit

            service-route     static-{{ model.node1Name }}-msbr-mgmt
                name          static-{{ model.node1Name }}-msbr-mgmt
                service-name  {{ model.node1Name }}-msbr-mgmt

                next-hop      {{ model.node1Name }} msbr-mgmt
                        node-name  {{ model.node1Name }}
                        interface  msbr-mgmt
                exit
            exit

            service-route     static-{{ model.node2Name }}-msbr-mgmt
                name          static-{{ model.node2Name }}-msbr-mgmt
                service-name  {{ model.node2Name }}-msbr-mgmt

                next-hop      {{ model.node2Name }} msbr-mgmt
                        node-name  {{ model.node2Name }}
                        interface  msbr-mgmt
                exit
            exit

            service-route     static-router-internet
               name          static-router-internet
               service-name  router-internet

               next-hop      {{ model.node2Name }} ADI-vlan0
                        node-name  {{ model.node2Name }}
                        interface  ADI-vlan0
                        gateway-ip {{ model.wanGw2 }}
               exit
            exit

            service-route    static-ics-noc-tools-md
               name          static-ics-noc-tools-md
               service-name  ics-noc-tools
               peer          CHSSDWHAMD
               service-route-policy  sessions-first
            exit

            service-route    static-ics-noc-tools-chi
               name          static-ics-noc-tools-chi
               service-name  ics-noc-tools
               peer          CHSSDWHACHI
               service-route-policy  sessions-second
            exit

            service-route-policy  sessions-first
               name          sessions-first
               description   "Highest Priority Path"
               max-sessions  1000000000
            exit

            service-route-policy  sessions-second
               name          sessions-second
               description   "Second Priority Path"
               max-sessions  100000000
            exit
        exit

        security  encrypt-hmac-disabled
            name                 encrypt-hmac-disabled
            description          "Encryption and message authentication disabled"
            encrypt              false
            hmac-mode            disabled
            adaptive-encryption  false
        exit

        tenant  hospitals.chs-site
            name      hospitals.chs-site

            member  {{ model.routerName }}-lan1
                neighborhood  {{ model.routerName }}-lan1
                address       {{ model.dataIPBlock1 }}
            exit
            member  {{ model.routerName }}-lan2
                neighborhood  {{ model.routerName }}-lan2
                address       {{ model.dataIPBlock2 }}
            exit
        exit

        service  {{ model.routerName }}-LAN-summary
            name           {{ model.routerName }}-LAN-summary

            applies-to       router
                type         router
                router-name  {{ model.routerName }}
            exit

            applies-to      router-group
                type        router-group
                group-name  bdc
            exit
            security       service-sec
            address        {{ model.dataIPBlock1 }}
            address        {{ model.dataIPBlock2 }}

            access-policy   chs-dc
                source      chs-dc
                permission  allow
            exit

            access-policy   chs-site
                source      chs-site
                permission  allow
            exit
            service-policy  Business-Data-MPLS
        exit

        service  guest-wifi
            name           guest-wifi

            applies-to      router-group
                type        router-group
                group-name  clinics
                group-name  hospitals
            exit
            security       encrypt-hmac-disabled
            address        0.0.0.0/0

            access-policy  chs-guest
                source      chs-guest
                permission  allow
            exit
            share-service-routes  false
        exit

        service  chs-internet
            name           chs-internet

            applies-to      router-group
                type        router-group
                group-name  clinics
                group-name  hospitals
                group-name  bdc
            exit
            security       encrypt-hmac-disabled
            address        0.0.0.0/0

            access-policy  chs-site
                source      chs-site
                permission  allow
            exit
            share-service-routes  false
        exit

        service  {{ model.node1Name }}-osn-mgmt
            name           {{ model.node1Name }}-osn-mgmt

            applies-to       router
                type         router
                router-name  {{ model.routerName }}
            exit

            applies-to      router-group
                type        router-group
                group-name  nds-dc
            exit
            security       service-sec
            address        {{ model.node1OSNLoopback }}

            access-policy  ics-mgmt
                source      ics-mgmt
                permission  allow
            exit
        exit

        service  {{ model.node2Name }}-osn-mgmt
            name           {{ model.node2Name }}-osn-mgmt

            applies-to       router
                type         router
                router-name  {{ model.routerName }}
            exit

            applies-to      router-group
                type        router-group
                group-name  nds-dc
            exit
            security       service-sec
            address        {{ model.node2OSNLoopback }}

            access-policy  ics-mgmt
                source      ics-mgmt
                permission  allow
            exit
        exit

        service  {{ model.node1Name }}-msbr-mgmt
            name           {{ model.node1Name }}-msbr-mgmt

            applies-to       router
                type         router
                router-name  {{ model.routerName }}
            exit

            applies-to      router-group
                type        router-group
                group-name  nds-dc
            exit
            security       service-sec
            address        {{ model.node1MSBRMgmt }}

            access-policy  ics-mgmt
                source      ics-mgmt
                permission  allow
            exit
        exit

        service  {{ model.node2Name }}-msbr-mgmt
            name           {{ model.node2Name }}-msbr-mgmt

            applies-to       router
                type         router
                router-name  {{ model.routerName }}
            exit

            applies-to      router-group
                type        router-group
                group-name  nds-dc
            exit
            security       service-sec
            address        {{ model.node2MSBRMgmt }}

            access-policy  ics-mgmt
                source      ics-mgmt
                permission  allow
            exit
        exit

        service  router-internet
            name           router-internet

            applies-to      router-group
                type        router-group
                group-name  clinics
                group-name  hospitals
            exit
            security       encrypt-hmac-disabled
            address        0.0.0.0/0

            access-policy  ics-mgmt
                source      ics-mgmt
                permission  allow
            exit
            share-service-routes  false
        exit

        service  ics-noc-tools
            name           ics-noc-tools

            security       service-sec
            address        216.88.36.160/28
            address        192.43.154.128/26

            access-policy  ics-mgmt
                source      ics-mgmt
                permission  allow
            exit
            share-service-routes  false
        exit
    exit
exit`

document.getElementById('configText').innerHTML = template

var model = {
/*
################################################################################
#                                                                              #
# Define each variable in the 'data' object, within the following script.      #
#                                                                              #
################################################################################
*/
  routerName: '',
  siteAddress: '',
  siteCoordinates: '',
  ntp1: '',
  ntp2: '',
  trapServer1: '',
  node1Name: '',
  node2Name: '',
  wanAddr1: '',
  wanPrefix1: '',
  wanGw1: '',
  wanAddr2: '',
  wanPrefix2: '',
  wanGw2: '',
  lanSharedMAC: '',
  lanAddr: '',
  lanPrefix: '',
  dataIPBlock1: '',
  dataIPBlock2: '',
  prismaIPtunnelIP: '',
  prismaPSK: '',
  LTEnode2APN: '',
  node1OSNLoopback: '',
  node2OSNLoopback: '',
  MSBRVoiceVlan: '',
  MSBRVoiceAddr: '',
  MSBRVoicePrefix: '',
  DNS1: '',
  DNS2: '',
  node1MSBRMgmt: '',
  node2MSBRMgmt: '',
}
